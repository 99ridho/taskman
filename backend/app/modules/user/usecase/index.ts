import { z, ZodError } from 'zod';
import { GeneralError } from '../../../error';
import User from '../domain';
import { fromUserDomain, toUserDomain } from '../dto';
import UserRepository from '../repository';
import jwt from 'jsonwebtoken';
import config from '../../../config';

export interface JwtPayload {
  user_id: string;
  id: number;
}

export class UserUseCase {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async login(params: { username: string; password: string }): Promise<string> {
    try {
      const schema = z.object({
        username: z.string().nonempty('username is required'),
        password: z.string().nonempty('password is required'),
      });

      const parsed = schema.parse(params);
      const registeredUserDto = await this.repository.findByUsername(
        parsed.username,
      );

      const registeredUser = toUserDomain(registeredUserDto);
      if (!registeredUser.checkPassword(params.password)) {
        const error: GeneralError = {
          name: 'user usecase error',
          message: 'cannot login, password not match',
          payload: {
            username: params.username,
          },
          errorType: 'BAD_REQUEST',
        };

        throw error;
      }

      return jwt.sign(
        {
          user_id: registeredUser.userID,
          id: registeredUser.primaryKey,
        },
        config.secretKey,
      );
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError: GeneralError = {
          details: (err as ZodError).errors.map((e) => {
            return {
              path: e.path,
              message: e.message,
            };
          }),
          name: 'user usecase error',
          message: 'cannot login due to validation error',
          errorType: 'BAD_REQUEST',
        };

        throw validationError;
      }

      throw err;
    }
  }

  async registerUser(params: {
    username: string;
    password: string;
  }): Promise<number> {
    try {
      const schema = z.object({
        username: z.string().nonempty('username is required'),
        password: z.string().nonempty('password is required'),
      });

      const parsed = schema.parse(params);
      const count = await this.repository.countByUsername(parsed.username);
      if (count != 0) {
        let error: GeneralError = {
          name: 'user usecase error',
          message: 'cannot register user, already exist',
          payload: {
            username: params.username,
          },
          errorType: 'UNPROCESSED_ENTITY',
        };

        throw error;
      }

      const newUser = User.createNew(params.username, params.password);
      const id = await this.repository.createUser({
        primary_key: 0,
        user_id: newUser.userID,
        username: newUser.username,
        password: newUser.password,
      });

      return id;
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError: GeneralError = {
          details: (err as ZodError).errors.map((e) => {
            return {
              path: e.path,
              message: e.message,
            };
          }),
          name: 'user usecase error',
          message: 'cannot register user due to validation error',
          errorType: 'BAD_REQUEST',
        };

        throw validationError;
      }

      throw err;
    }
  }

  async changePassword(userID: string, newPassword: string): Promise<boolean> {
    try {
      const user = await this.repository.findByUserID(userID);
      const userDomain = toUserDomain(user);
      userDomain.changePassword(newPassword);

      await this.repository.updateByUserID(userID, fromUserDomain(userDomain));

      return true;
    } catch (err) {
      let error: GeneralError = {
        name: 'user usecase error',
        message: (err as Error).message,
        payload: {
          user_id: userID,
        },
        errorType: (err as GeneralError).errorType,
        details: (err as GeneralError).details,
      };

      throw error;
    }
  }
}
