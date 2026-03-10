import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service';
import { SecurityEvent } from './entities/security-event.entity';
import { User } from '../users/entities/user.entity';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: {
    findOne: jest.Mock;
    save: jest.Mock;
    create: jest.Mock;
  };
  let securityEventRepository: {
    save: jest.Mock;
    create: jest.Mock;
  };
  let configService: {
    get: jest.Mock;
    getOrThrow: jest.Mock;
  };
  let jwtService: {
    signAsync: jest.Mock;
    verifyAsync: jest.Mock;
  };

  const argon2Hash = argon2.hash as jest.MockedFunction<typeof argon2.hash>;
  const argon2Verify = argon2.verify as jest.MockedFunction<
    typeof argon2.verify
  >;

  const makeUser = (overrides: Partial<User> = {}): User =>
    ({
      id: 1,
      email: 'user@example.com',
      passwordHash: 'stored-password-hash',
      role: 'user',
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
      refreshTokenHash: null,
      refreshTokenExpiresAt: null,
      failedLoginAttempts: 0,
      loginLockedUntil: null,
      lastFailedLoginAt: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      ...overrides,
    }) as User;

  beforeEach(async () => {
    jest.clearAllMocks();

    usersRepository = {
      findOne: jest.fn(),
      save: jest.fn((entity: User) => Promise.resolve(entity)),
      create: jest.fn((entity: Partial<User>) => entity as User),
    };

    securityEventRepository = {
      create: jest.fn(
        (entity: Partial<SecurityEvent>) => entity as SecurityEvent,
      ),
      save: jest.fn((entity: SecurityEvent) => Promise.resolve(entity)),
    };

    configService = {
      get: jest.fn((key: string, defaultValue?: unknown) => {
        const map: Record<string, unknown> = {
          JWT_REFRESH_EXPIRES_IN: '7d',
          JWT_REFRESH_PREVIOUS_SECRETS: '',
          NODE_ENV: 'test',
        };

        if (key in map) {
          return map[key];
        }

        return defaultValue;
      }),
      getOrThrow: jest.fn((key: string) => {
        const map: Record<string, string> = {
          JWT_REFRESH_SECRET: 'refresh-secret-current',
        };

        if (!(key in map)) {
          throw new Error(`Missing key: ${key}`);
        }

        return map[key];
      }),
    };

    jwtService = {
      signAsync: jest
        .fn()
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token-new'),
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: usersRepository },
        {
          provide: getRepositoryToken(SecurityEvent),
          useValue: securityEventRepository,
        },
        { provide: ConfigService, useValue: configService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('locks account at first lockout tier after repeated bad password attempts', async () => {
    const user = makeUser({ failedLoginAttempts: 9 });
    usersRepository.findOne.mockResolvedValue(user);
    argon2Verify.mockResolvedValue(false);

    await expect(
      service.login({ email: user.email, password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    const saveCalls = usersRepository.save.mock.calls as Array<[User]>;
    const updatedUser = saveCalls[0][0];
    expect(updatedUser.failedLoginAttempts).toBe(10);
    expect(updatedUser.loginLockedUntil).toBeInstanceOf(Date);
  });

  it('resets failed attempts after reset window before counting new failure', async () => {
    const staleFailureDate = new Date(Date.now() - 31 * 60 * 1000);
    const user = makeUser({
      failedLoginAttempts: 7,
      lastFailedLoginAt: staleFailureDate,
    });

    usersRepository.findOne.mockResolvedValue(user);
    argon2Verify.mockResolvedValue(false);

    await expect(
      service.login({ email: user.email, password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(usersRepository.save).toHaveBeenCalledTimes(2);

    const saveCalls = usersRepository.save.mock.calls as Array<[User]>;
    const failedAttemptSave = saveCalls[1][0];
    expect(failedAttemptSave.failedLoginAttempts).toBe(1);
    expect(failedAttemptSave.loginLockedUntil).toBeNull();

    expect(securityEventRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'LOGIN_COUNTER',
        outcome: 'RESET_WINDOW',
      }),
    );
  });

  it('returns tokens and resets counters on successful login', async () => {
    const user = makeUser({
      failedLoginAttempts: 3,
      lastFailedLoginAt: new Date(),
    });
    usersRepository.findOne.mockResolvedValue(user);

    argon2Verify.mockResolvedValue(true);
    argon2Hash.mockResolvedValue('refresh-token-hash');

    const result = await service.login({
      email: user.email,
      password: 'CorrectPassword123!',
    });

    expect(argon2Verify).toHaveBeenCalledWith(
      user.passwordHash,
      'CorrectPassword123!',
    );
    expect(argon2Hash).toHaveBeenCalledWith('refresh-token-new');
    expect(result.access_token).toBe('access-token');
    expect(result.refresh_token).toBe('refresh-token-new');

    const saveCalls = usersRepository.save.mock.calls as Array<[User]>;
    const latestSavedUser = saveCalls.at(-1)?.[0];
    expect(latestSavedUser?.failedLoginAttempts).toBe(0);
    expect(latestSavedUser?.lastFailedLoginAt).toBeNull();
    expect(latestSavedUser?.refreshTokenHash).toBe('refresh-token-hash');
  });

  it('rotates refresh token when previous refresh secret is used', async () => {
    configService.get.mockImplementation(
      (key: string, defaultValue?: unknown) => {
        if (key === 'JWT_REFRESH_PREVIOUS_SECRETS') {
          return 'refresh-secret-old';
        }
        if (key === 'JWT_REFRESH_EXPIRES_IN') {
          return '7d';
        }
        if (key === 'NODE_ENV') {
          return 'test';
        }
        return defaultValue;
      },
    );

    jwtService.verifyAsync.mockImplementation(
      (_token: string, options?: { secret?: string }) => {
        if (options?.secret === 'refresh-secret-current') {
          return Promise.reject(new Error('invalid current secret'));
        }

        return Promise.resolve({
          sub: 1,
          email: 'user@example.com',
          role: 'user',
        });
      },
    );

    jwtService.signAsync
      .mockReset()
      .mockResolvedValueOnce('access-token-2')
      .mockResolvedValueOnce('refresh-token-2');

    const user = makeUser({
      refreshTokenHash: 'stored-refresh-hash',
      refreshTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });
    usersRepository.findOne.mockResolvedValue(user);

    argon2Verify.mockResolvedValue(true);
    argon2Hash.mockResolvedValue('new-refresh-token-hash');

    const result = await service.refreshTokens({
      refreshToken: 'old-secret-refresh-token',
    });

    expect(argon2Verify).toHaveBeenCalledWith(
      'stored-refresh-hash',
      'old-secret-refresh-token',
    );
    expect(argon2Hash).toHaveBeenCalledWith('refresh-token-2');
    expect(result.access_token).toBe('access-token-2');
    expect(result.refresh_token).toBe('refresh-token-2');
  });

  it('forgotPassword returns generic message and does not send email when user does not exist', async () => {
    usersRepository.findOne.mockResolvedValue(null);
    const sendPasswordResetEmailSpy = jest
      .spyOn(service as any, 'sendPasswordResetEmail')
      .mockImplementation(() => Promise.resolve());

    const result = await service.forgotPassword({
      email: 'missing@example.com',
    });

    expect(result.message).toContain('lien de réinitialisation');
    expect(sendPasswordResetEmailSpy).not.toHaveBeenCalled();
    expect(securityEventRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'PASSWORD_RESET_REQUEST',
        email: 'missing@example.com',
        outcome: 'NO_USER',
      }),
    );
  });

  it('forgotPassword issues reset token and logs event when user exists', async () => {
    const user = makeUser();
    usersRepository.findOne.mockResolvedValue(user);
    const sendPasswordResetEmailSpy = jest
      .spyOn(service as any, 'sendPasswordResetEmail')
      .mockImplementation(() => Promise.resolve());

    const result = await service.forgotPassword({ email: user.email });

    expect(result.message).toContain('lien de réinitialisation');
    expect(sendPasswordResetEmailSpy).toHaveBeenCalledTimes(1);
    expect(usersRepository.save).toHaveBeenCalled();

    const saveCalls = usersRepository.save.mock.calls as Array<[User]>;
    const savedUser = saveCalls[0][0];
    expect(savedUser.passwordResetTokenHash).toBeTruthy();
    expect(savedUser.passwordResetExpiresAt).toBeInstanceOf(Date);

    expect(securityEventRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'PASSWORD_RESET_REQUEST',
        email: user.email,
        outcome: 'ISSUED',
      }),
    );
  });

  it('resetPassword throws for invalid or expired token', async () => {
    usersRepository.findOne.mockResolvedValue(null);

    await expect(
      service.resetPassword({
        token: 'invalid-token',
        newPassword: 'StrongPassword123!',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('resetPassword updates password and invalidates refresh token fields', async () => {
    const user = makeUser({
      passwordResetTokenHash: 'stored-reset-hash',
      passwordResetExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      refreshTokenHash: 'refresh-hash',
      refreshTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    usersRepository.findOne.mockResolvedValue(user);
    argon2Hash.mockResolvedValue('new-password-hash');

    const result = await service.resetPassword({
      token: 'valid-reset-token',
      newPassword: 'StrongPassword123!',
    });

    expect(result.message).toContain('réinitialisé');

    const saveCalls = usersRepository.save.mock.calls as Array<[User]>;
    const savedUser = saveCalls[0][0];
    expect(savedUser.passwordHash).toBe('new-password-hash');
    expect(savedUser.passwordResetTokenHash).toBeNull();
    expect(savedUser.passwordResetExpiresAt).toBeNull();
    expect(savedUser.refreshTokenHash).toBeNull();
    expect(savedUser.refreshTokenExpiresAt).toBeNull();
  });

  it('refreshTokens rejects invalid refresh token and logs failure event', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid token'));

    await expect(
      service.refreshTokens({ refreshToken: 'forged-refresh-token' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(securityEventRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'REFRESH',
        outcome: 'FAILED_INVALID_TOKEN',
      }),
    );
  });

  it('logout stays idempotent when refresh token is invalid', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid token'));

    const result = await service.logout({ refreshToken: 'invalid-token' });

    expect(result).toEqual({ message: 'Déconnexion réussie.' });
    expect(securityEventRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'LOGOUT',
        outcome: 'SUCCESS_IDEMPOTENT',
      }),
    );
  });
});
