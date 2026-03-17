import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

jest.mock(
  'src/auth/guards/jwt-auth.guard',
  () => ({ JwtAuthGuard: class JwtAuthGuard {} }),
  { virtual: true },
);
jest.mock(
  'src/auth/guards/roles.guard',
  () => ({ RolesGuard: class RolesGuard {} }),
  { virtual: true },
);
jest.mock(
  'src/auth/decorators/roles.decorator',
  () => ({ Roles: () => () => undefined }),
  { virtual: true },
);

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: {
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };
  const emailFor = (id: number): string => `test-user-${id}@local.test`;

  beforeEach(async () => {
    usersService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll delegates to UsersService.findAll', async () => {
    usersService.findAll.mockResolvedValue([{ id: 1, email: emailFor(1) }]);

    const result = await controller.findAll();

    expect(usersService.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ id: 1, email: emailFor(1) }]);
  });

  it('findOne delegates to UsersService.findOne', async () => {
    usersService.findOne.mockResolvedValue({ id: 2, email: emailFor(2) });

    const result = await controller.findOne(2);

    expect(usersService.findOne).toHaveBeenCalledWith(2);
    expect(result).toEqual({ id: 2, email: emailFor(2) });
  });

  it('update delegates to UsersService.update', async () => {
    usersService.update.mockResolvedValue({
      id: 3,
      lastName: null,
      firstName: null,
      phone: null,
      email: emailFor(3),
      message: 'Profil mis à jour avec succès.',
    });

    const result = await controller.update(3, {
      lastName: null,
      firstName: null,
      phone: null,
      email: emailFor(3),
    });

    expect(usersService.update).toHaveBeenCalledWith(3, {
      lastName: null,
      firstName: null,
      phone: null,
      email: emailFor(3),
    });
    expect(result).toEqual({
      id: 3,
      lastName: null,
      firstName: null,
      phone: null,
      email: emailFor(3),
      message: 'Profil mis à jour avec succès.',
    });
  });

  it('remove delegates to UsersService.remove', async () => {
    usersService.remove.mockResolvedValue({
      message: 'Utilisateur supprimé avec succès.',
    });

    const result = await controller.remove(4);

    expect(usersService.remove).toHaveBeenCalledWith(4);
    expect(result).toEqual({ message: 'Utilisateur supprimé avec succès.' });
  });
});
