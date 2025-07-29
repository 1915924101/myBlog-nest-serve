import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

// 模拟jwt.sign方法
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked_token'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'testpassword';
      const user = { id: 1, username, password };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(user as User);
      jest.spyOn(repository, 'save').mockResolvedValue(user as User);

      // Act
      const result = await service.register(username, password);

      // Assert
      expect(result).toEqual({
        code: 0,
        status: 'success',
        message: '注册成功',
        data: { username },
      });
      expect(repository.findOne).toHaveBeenCalledWith({ where: { username } });
      expect(repository.create).toHaveBeenCalledWith({ username, password });
      expect(repository.save).toHaveBeenCalledWith(user);
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange
      const username = 'existinguser';
      const password = 'testpassword';
      const existingUser = { id: 1, username, password };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingUser as User);

      // Act & Assert
      await expect(service.register(username, password)).rejects.toThrow(ConflictException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { username } });
    });
  });

  describe('login', () => {
    it('should login successfully and return token', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'testpassword';
      const user = { id: 1, username, password };

      jest.spyOn(repository, 'findOne').mockResolvedValue(user as User);

      // Act
      const result = await service.login(username, password);

      // Assert
      expect(result).toEqual({
        code: 0,
        status: 'success',
        message: '登录成功',
        data: { username, token: 'mocked_token' },
      });
      expect(repository.findOne).toHaveBeenCalledWith({ where: { username, password } });
      expect(jwt.sign).toHaveBeenCalledWith({ username }, 'mytoken');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      const username = 'nonexistentuser';
      const password = 'testpassword';

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(username, password)).rejects.toThrow(UnauthorizedException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { username, password } });
    });
  });
});