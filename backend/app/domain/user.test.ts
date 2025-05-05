import User from './user';
import { expect, describe, test } from 'vitest';

describe('test user domain', () => {
  test('create user success', () => {
    const user = new User('abc', 'Abc123');
    expect(user.userID).toBeDefined();
    expect(user.username).toEqual('abc');
    expect(user.checkPassword('Abc123')).toBe(true);
  });

  test('create user failed', () => {
    expect(() => {
      new User('abc', 'abc123');
    }).toThrow('cannot create user due to validation error');
  });

  test('change password success', () => {
    const user = new User('abc', 'Abc123');
    user.changePassword('0Abc');

    expect(user.checkPassword('0Abc')).toBe(true);
  });

  test('change password failed', () => {
    expect(() => {
      const user = new User('abc', 'Abc123');
      user.changePassword('0abc');
    }).toThrow('cannot change password due to validation error');
  });
});
