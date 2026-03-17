import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

jest.mock('argon2', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: {
    find: jest.Mock;
    findOne: jest.Mock;
    save: jest.Mock;
    remove: jest.Mock;
  };

  const argon2Hash = argon2.hash as jest.MockedFunction<typeof argon2.hash>;
  const emailFor = (id: number): string => `test-user-${id}@local.test`;

  const makeUser = (overrides: Partial<User> = {}): User =>
    ({
      id: 1,
      lastName: null,
      firstName: null,
      phone: null,
      email: emailFor(1),
      passwordHash: 'password-hash',
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
    usersRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn((user: User) => Promise.resolve(user)),
      remove: jest.fn((user: User) => Promise.resolve(user)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: usersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll returns sanitized users without sensitive fields', async () => {
    usersRepository.find.mockResolvedValue([
      makeUser(),
      makeUser({ id: 2, email: emailFor(2), role: 'admin' }),
    ]);

    const result = await service.findAll();

    expect(result).toEqual([
      expect.objectContaining({
        id: 1,
        lastName: null,
        firstName: null,
        phone: null,
        email: emailFor(1),
        role: 'user',
      }),
      expect.objectContaining({
        id: 2,
        lastName: null,
        firstName: null,
        phone: null,
        email: emailFor(2),
        role: 'admin',
      }),
    ]);
    expect(result[0]).not.toHaveProperty('passwordHash');
    expect(result[0]).not.toHaveProperty('refreshTokenHash');
  });

  it('findOne throws NotFoundException when user does not exist', async () => {
    usersRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('update throws ConflictException when email is already used by another user', async () => {
    usersRepository.findOne
      .mockResolvedValueOnce(makeUser({ id: 1, email: emailFor(10) }))
      .mockResolvedValueOnce(makeUser({ id: 2, email: emailFor(20) }));

    await expect(
      service.update(1, { email: emailFor(20) }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('update hashes password and returns sanitized response', async () => {
    const user = makeUser({ id: 3, email: emailFor(3) });
    usersRepository.findOne.mockResolvedValue(user);
    argon2Hash.mockResolvedValue('new-password-hash');

    const result = await service.update(3, {
      password: 'StrongPassword123!',
    });

    const saveCalls = usersRepository.save.mock.calls as Array<[User]>;
    const savedUser = saveCalls[0][0];
    expect(savedUser.passwordHash).toBe('new-password-hash');
    expect(result).toEqual(
      expect.objectContaining({
        id: 3,
        lastName: null,
        firstName: null,
        phone: null,
        email: emailFor(3),
        message: 'Mot de passe mis à jour avec succès.',
      }),
    );
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('update persists profile fields and returns a profile message', async () => {
    const user = makeUser({ id: 5, email: emailFor(5) });
    usersRepository.findOne.mockResolvedValue(user);

    const result = await service.update(5, {
      lastName: null,
      firstName: null,
      phone: null,
    });

    const saveCalls = usersRepository.save.mock.calls as Array<[User]>;
    const savedUser = saveCalls[0][0];
    expect(savedUser.lastName).toBeNull();
    expect(savedUser.firstName).toBeNull();
    expect(savedUser.phone).toBeNull();
    expect(result).toEqual(
      expect.objectContaining({
        id: 5,
        lastName: null,
        firstName: null,
        phone: null,
        email: emailFor(5),
        message: 'Profil mis à jour avec succès.',
      }),
    );
  });

  it('remove returns success message when user exists', async () => {
    const user = makeUser({ id: 4 });
    usersRepository.findOne.mockResolvedValue(user);

    const result = await service.remove(4);

    expect(usersRepository.remove).toHaveBeenCalledWith(user);
    expect(result).toEqual({ message: 'Utilisateur supprimé avec succès.' });
  });
});
