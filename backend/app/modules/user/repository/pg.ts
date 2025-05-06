import UserRepository from '.';
import { GeneralError } from '../../../error';
import { UserDTO } from '../dto';
import { Pool } from 'pg';

class PostgresUserRepository implements UserRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findByUserID(userID: string): Promise<UserDTO> {
    try {
      const result = await this.pool.query(
        'select * from users where user_id = $1',
        [userID],
      );

      if (result.rowCount == 0) {
        const error: GeneralError = {
          name: 'postgres user repository error',
          message: 'user not found',
          payload: {
            user_id: userID,
          },
          errorType: 'NOT_FOUND',
        };

        throw error;
      }

      const user = result.rows[0];

      return {
        primary_key: user.id,
        user_id: user.user_id,
        username: user.username,
        password: user.password,
        created_at: user.created_at,
        updated_at: user.updated_at,
        deleted_at: user.deleted_at,
      };
    } catch (err) {
      throw err;
    }
  }

  async findByUsername(username: string): Promise<UserDTO> {
    try {
      const result = await this.pool.query(
        'select * from users where username = $1',
        [username],
      );

      if (result.rowCount == 0) {
        const error: GeneralError = {
          name: 'postgres user repository error',
          message: 'user not found',
          payload: {
            username: username,
          },
          errorType: 'NOT_FOUND',
        };

        throw error;
      }

      const user = result.rows[0];

      return {
        primary_key: user.id,
        user_id: user.user_id,
        username: user.username,
        password: user.password,
        created_at: user.created_at,
        updated_at: user.updated_at,
        deleted_at: user.deleted_at,
      };
    } catch (err) {
      throw err;
    }
  }

  async deleteByUserID(userID: string): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'update users set deleted_at = NOW() where user_id = $1',
        [userID],
      );

      if (result.rowCount == 0) {
        const error: GeneralError = {
          name: 'postgres user repository error',
          message: 'user not found',
          payload: {
            user_id: userID,
          },
          errorType: 'NOT_FOUND',
        };
        throw error;
      }

      return true;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }

  async updateByUserID(userID: string, arg: UserDTO): Promise<UserDTO> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'update users set username = $1, password = $2, updated_at = NOW() where user_id = $3 returning *',
        [arg.username, arg.password, userID],
      );

      if (result.rowCount == 0) {
        const error: GeneralError = {
          name: 'postgres user repository error',
          message: 'user not found',
          payload: {
            user_id: userID,
          },
          errorType: 'NOT_FOUND',
        };
        throw error;
      }

      const user = result.rows[0];
      return {
        primary_key: user.id,
        user_id: user.user_id,
        username: user.username,
        password: user.password,
        created_at: user.created_at,
        updated_at: user.updated_at,
        deleted_at: user.deleted_at,
      };
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }

  async createUser(arg: UserDTO): Promise<string> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'insert into users (user_id, username, password, created_at) values ($1, $2, $3, now()) returning user_id',
        [arg.user_id, arg.username, arg.password],
      );

      if (result.rowCount == 0) {
        const error: GeneralError = {
          name: 'postgres user repository error',
          message: 'failed to create user',
          payload: arg,
          errorType: 'UNPROCESSED_ENTITY',
        };
        throw error;
      }

      return result.rows[0].user_id;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }

  async countByUsername(username: string): Promise<number> {
    try {
      const result = await this.pool.query(
        'select count(username) as cnt from users where username = $1',
        [username],
      );

      return result.rows[0].cnt;
    } catch (err) {
      throw err;
    }
  }
}

export default PostgresUserRepository;
