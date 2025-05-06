import { ulid } from 'ulid';
import { z, ZodError } from 'zod';
import { GeneralError } from '../../../error';
import { compareSync, genSaltSync, hashSync } from 'bcrypt-ts';
import { passwordSchema, userSchema } from './schema';

class User {
  readonly id: number;
  private _userID: string;
  private _username: string;
  private _password: string;
  private _createdAt: Date;
  private _updatedAt?: Date;
  private _deletedAt?: Date;

  get userID(): string {
    return this._userID;
  }

  get username(): string {
    return this._username;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  get password(): string {
    return this._password;
  }

  constructor(
    id: number,
    userID: string,
    username: string,
    password: string,
    createdAt: Date,
    updatedAt?: Date,
    deletedAt?: Date,
  ) {
    this.id = id;
    this._userID = userID;
    this._username = username;
    this._password = password;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
  }

  static createNew(username: string, password: string): User {
    try {
      const parsed = userSchema.parse({
        username: username,
        password: password,
      });

      return new User(
        0,
        ulid(),
        parsed.username,
        User.makePasswordFromText(parsed.password),
        new Date(),
      );
    } catch (err) {
      const validationError: GeneralError = {
        details: (err as ZodError).errors.map((e) => {
          return {
            path: e.path,
            message: e.message,
          };
        }),
        name: 'create user error',
        message: 'cannot create user due to validation error',
        errorType: 'BAD_REQUEST',
      };

      throw validationError;
    }
  }

  changePassword(password: string) {
    try {
      const parsed = passwordSchema.parse(password);
      this._password = User.makePasswordFromText(parsed);
      this._updatedAt = new Date();
    } catch (err) {
      const validationError: GeneralError = {
        details: (err as ZodError).errors.map((e) => {
          return {
            path: e.path,
            message: e.message,
          };
        }),
        name: 'change password error',
        message: 'cannot change password due to validation error',
        errorType: 'BAD_REQUEST',
      };

      throw validationError;
    }
  }

  checkPassword(password: string): boolean {
    return compareSync(password, this._password);
  }

  static makePasswordFromText(password: string): string {
    const salt = genSaltSync(10);
    const result = hashSync(password, salt);

    return result;
  }
}

export default User;
