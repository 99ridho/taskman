import { ulid } from 'ulid';
import { z, ZodError } from 'zod';
import { GeneralError } from '../error';
import { compareSync, genSaltSync, hashSync } from 'bcrypt-ts';

const passwordSchema = z
  .string()
  .regex(new RegExp('^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$'))
  .nonempty(
    'password is required -- at least contains number, lowercase and uppercase',
  );

const userSchema = z.object({
  userID: z.string().nonempty('user id is required'),
  username: z.string().nonempty('username is required'),
  password: passwordSchema,
});

class User {
  userID: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(username: string, password: string) {
    try {
      const parsed = userSchema.parse({
        userID: ulid(),
        username: username,
        password: password,
      });

      this.userID = parsed.userID;
      this.username = parsed.username;
      this.password = User.makePasswordFromText(parsed.password);
      this.createdAt = new Date();
    } catch (err) {
      const validationError: GeneralError = {
        errors: (err as ZodError).errors.map((e) => {
          return {
            path: e.path,
            message: e.message,
          };
        }),
        name: 'create user error',
        message: 'cannot create user due to validation error',
      };

      throw validationError;
    }
  }

  changePassword(password: string) {
    try {
      const parsed = passwordSchema.parse(password);
      this.password = User.makePasswordFromText(parsed);
      this.updatedAt = new Date();
    } catch (err) {
      const validationError: GeneralError = {
        errors: (err as ZodError).errors.map((e) => {
          return {
            path: e.path,
            message: e.message,
          };
        }),
        name: 'change password error',
        message: 'cannot change password due to validation error',
      };

      throw validationError;
    }
  }

  checkPassword(password: string): boolean {
    return compareSync(password, this.password);
  }

  private static makePasswordFromText(password: string): string {
    const salt = genSaltSync(10);
    const result = hashSync(password, salt);

    return result;
  }
}

export default User;
