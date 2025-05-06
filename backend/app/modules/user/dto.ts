import User from './domain';

export type UserDTO = {
  primary_key: number;
  user_id: string;
  username: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
};

export function toUserDomain(dto: UserDTO): User {
  return new User(
    dto.primary_key,
    dto.user_id,
    dto.username,
    dto.password,
    dto.created_at ?? new Date(),
    dto.updated_at,
    dto.deleted_at,
  );
}

export function fromUserDomain(user: User): UserDTO {
  return {
    primary_key: user.primaryKey,
    user_id: user.userID,
    password: user.password,
    username: user.username,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    deleted_at: user.deletedAt,
  };
}
