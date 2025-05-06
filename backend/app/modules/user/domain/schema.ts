import { z } from 'zod';

export const passwordSchema = z
  .string({
    errorMap: (issue, ctx) => {
      if (issue.code == 'invalid_string') {
        return {
          message: 'password at least contains uppercase, lowercase and number',
        };
      }

      return { message: ctx.defaultError };
    },
  })
  .regex(new RegExp('^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$'))
  .nonempty('password is required');

export const userSchema = z.object({
  username: z.string().nonempty('username is required'),
  password: passwordSchema,
});
