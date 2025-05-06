import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserUseCase } from '.';
import UserRepository from '../repository';
import User from '../domain';
import jwt from 'jsonwebtoken';
import config from '../../../config';
import { JwtPayload } from '../../../middlewares/jwt';

describe('UserService', () => {
  let userService: UserUseCase;
  let mockUserRepository: UserRepository;

  beforeEach(() => {
    mockUserRepository = {
      findByUserID: vi.fn(),
      deleteByUserID: vi.fn(),
      updateByUserID: vi.fn(),
      createUser: vi.fn(),
      findByUsername: vi.fn(),
      countByUsername: vi.fn(),
    };
    userService = new UserUseCase(mockUserRepository);
  });

  describe('login', () => {
    it('should successfully login and return JWT token', async () => {
      vi.spyOn(mockUserRepository, 'findByUsername').mockResolvedValue({
        id: 1,
        user_id: 'user1',
        password: User.makePasswordFromText('Abc123'),
        username: 'testuser',
      });

      const result = await userService.login({
        username: 'testuser',
        password: 'Abc123',
      });

      const payload = jwt.verify(result || '', config.secretKey) as JwtPayload;

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(payload.user_id).toBe('user1');
      expect(payload.id).toBe(1);
    });

    it('should throw error when username does not exist', async () => {
      vi.spyOn(mockUserRepository, 'findByUsername').mockRejectedValue(
        'not found',
      );

      await expect(
        userService.login({
          username: 'nonexistent',
          password: 'Abc123',
        }),
      ).rejects.toThrowError('not found');
    });

    it('should throw error when password does not match', async () => {
      vi.spyOn(mockUserRepository, 'findByUsername').mockResolvedValue({
        id: 1,
        user_id: 'user1',
        password: User.makePasswordFromText('Abc123'),
        username: 'testuser',
      });

      await expect(
        userService.login({
          username: 'testuser',
          password: 'wrongpass',
        }),
      ).rejects.toThrowError('cannot login, password not match');
    });

    it('should throw validation error when username is empty', async () => {
      await expect(
        userService.login({
          username: '',
          password: 'Abc123',
        }),
      ).rejects.toThrowError('cannot login due to validation error');
    });

    it('should throw validation error when password is empty', async () => {
      await expect(
        userService.login({
          username: 'testuser',
          password: '',
        }),
      ).rejects.toThrow('cannot login due to validation error');
    });
  });

  describe('register', () => {
    it('should create a new user', async () => {
      vi.spyOn(mockUserRepository, 'countByUsername').mockResolvedValue(0);
      vi.spyOn(mockUserRepository, 'createUser').mockResolvedValue('1ABC');

      await expect(
        userService.registerUser({
          username: 'abc123',
          password: 'Abc123',
        }),
      ).resolves.toBe('1ABC');
    });

    it('should throw error due to unsatisfied password requirement', async () => {
      vi.spyOn(mockUserRepository, 'countByUsername').mockResolvedValue(0);
      await expect(
        userService.registerUser({
          username: 'abc123',
          password: 'xbc123',
        }),
      ).rejects.toThrowError('cannot create user due to validation error');
    });

    it('should throw error when already exist', async () => {
      vi.spyOn(mockUserRepository, 'countByUsername').mockResolvedValue(1);

      await expect(
        userService.registerUser({
          username: 'abc123',
          password: 'Abc123',
        }),
      ).rejects.toThrowError('cannot register user, already exist');
    });

    it('should throw validation error when username is empty', async () => {
      await expect(
        userService.registerUser({
          username: '',
          password: 'Abc123',
        }),
      ).rejects.toThrowError('cannot register user due to validation error');
    });

    it('should throw validation error when password is empty', async () => {
      await expect(
        userService.registerUser({
          username: 'testuser',
          password: '',
        }),
      ).rejects.toThrow('cannot register user due to validation error');
    });
  });

  describe('change password', () => {
    it('should changes the password if password requirement is satisfied', async () => {
      vi.spyOn(mockUserRepository, 'findByUserID').mockResolvedValue({
        id: 1,
        user_id: 'user1',
        password: 'XAc123',
        username: 'foo',
      });

      vi.spyOn(mockUserRepository, 'updateByUserID').mockResolvedValue({
        id: 1,
        user_id: 'user1',
        password: '123ACx',
        username: 'foo',
      });

      await expect(userService.changePassword('user1', '123ACx')).resolves.toBe(
        true,
      );
    });

    it('should throw an error if password requirement is not satisfied', async () => {
      vi.spyOn(mockUserRepository, 'findByUserID').mockResolvedValue({
        id: 1,
        user_id: 'user1',
        password: 'XAc123',
        username: 'foo',
      });

      await expect(
        userService.changePassword('user1', '123ACX'),
      ).rejects.toThrowError('cannot change password due to validation error');
    });
  });
});
