import { Pool } from 'pg';
import TaskRepository from '.';
import { TaskDTO, TaskSummary } from '../dto';
import { GeneralError } from '../../../error';

export default class PostgresTaskRepository implements TaskRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findTaskByTaskID(taskID: string, ownerID: number): Promise<TaskDTO> {
    try {
      const result = await this.pool.query(
        'select * from tasks where task_id = $1 and deleted_at is null and belongs_to = $2',
        [taskID, ownerID],
      );

      if (result.rows.length == 0) {
        const error: GeneralError = {
          name: 'postgres task repository error',
          message: 'task not found',
          payload: {
            task_id: taskID,
          },
          errorType: 'NOT_FOUND',
        };

        throw error;
      }

      const task = result.rows[0];

      return {
        description: task.description,
        is_completed: task.is_completed,
        id: task.id,
        priority: task.priority,
        task_id: task.task_id,
        title: task.title,
        created_at: task.created_at,
        deleted_at: task.deleted_at,
        due_date: task.due_date,
        owner_id: task.belongs_to,
        project_id: task.project_id,
        updated_at: task.updated_at,
      };
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType || 'SERVER_ERROR',
        message: (err as GeneralError).message || (err as Error).message,
        name: 'postgres task repository error',
        payload: {
          task_id: taskID,
        },
      } as GeneralError;
    }
  }

  async findAllTasks(
    ownerID: number,
    limit: number,
    offset: number,
  ): Promise<[TaskDTO[], number]> {
    try {
      const result = await this.pool.query(
        'select * from tasks where deleted_at is null and belongs_to = $1 limit $2 offset $3',
        [ownerID, limit, offset],
      );

      const tasks = result.rows.map((task) => {
        return {
          description: task.description,
          is_completed: task.is_completed,
          id: task.id,
          priority: task.priority,
          task_id: task.task_id,
          title: task.title,
          created_at: task.created_at,
          deleted_at: task.deleted_at,
          due_date: task.due_date,
          owner_id: task.belongs_to,
          project_id: task.project_id,
          updated_at: task.updated_at,
        };
      });

      const totalRecordsResult = await this.pool.query(
        'select count(id)::int as cnt from tasks where deleted_at is null and belongs_to = $1',
        [ownerID],
      );

      return [tasks, totalRecordsResult.rows[0].cnt as number];
    } catch (err) {
      throw {
        errorType: 'SERVER_ERROR',
        message: (err as Error).message,
        name: 'postgres task repository error',
        payload: {
          limit: limit,
          offset: offset,
        },
      } as GeneralError;
    }
  }

  async updateTaskByTaskID(
    taskID: string,
    ownerID: number,
    arg: TaskDTO,
  ): Promise<TaskDTO> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `update
          tasks
        set
          updated_at = NOW(),
          is_completed = $2,
          project_id = $3,
          title = $4,
          description = $5,
          priority = $6,
          due_date = $7
        where
          task_id = $1 AND belongs_to = $8
        returning *`,
        [
          taskID,
          arg.is_completed,
          arg.project_id,
          arg.title,
          arg.description,
          arg.priority,
          arg.due_date,
          ownerID,
        ],
      );

      if (result.rowCount == 0) {
        const error: GeneralError = {
          name: 'postgres task repository error',
          message: 'task not found',
          payload: {
            task_id: taskID,
          },
          errorType: 'NOT_FOUND',
        };
        throw error;
      }

      const task = result.rows[0];

      return {
        description: task.description,
        is_completed: task.is_completed,
        id: task.id,
        priority: task.priority,
        task_id: task.task_id,
        title: task.title,
        created_at: task.created_at,
        deleted_at: task.deleted_at,
        due_date: task.due_date,
        owner_id: task.belongs_to,
        project_id: task.project_id,
        updated_at: task.updated_at,
      };
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType || 'SERVER_ERROR',
        message: (err as GeneralError).message || (err as Error).message,
        name: 'postgres task repository error',
        payload: {
          task_id: taskID,
        },
      } as GeneralError;
    } finally {
      client.release();
    }
  }

  async deleteTaskByTaskID(taskID: string, ownerID: number): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'update tasks set deleted_at = NOW() where task_id = $1 and belongs_to = $2',
        [taskID, ownerID],
      );

      if (result.rowCount == 0) {
        const error: GeneralError = {
          name: 'postgres task repository error',
          message: 'task not found',
          payload: {
            task_id: taskID,
          },
          errorType: 'NOT_FOUND',
        };
        throw error;
      }

      return true;
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType || 'SERVER_ERROR',
        message: (err as GeneralError).message || (err as Error).message,
        name: 'postgres task repository error',
        payload: {
          task_id: taskID,
        },
      } as GeneralError;
    } finally {
      client.release();
    }
  }

  async createTask(arg: TaskDTO): Promise<string> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'insert into tasks (task_id, title, description, priority, belongs_to, due_date, project_id) values ($1, $2, $3, $4, $5, $6, $7) returning task_id',
        [
          arg.task_id,
          arg.title,
          arg.description,
          arg.priority,
          arg.owner_id,
          arg.due_date,
          arg.project_id,
        ],
      );

      if (result.rowCount == 0) {
        const error: GeneralError = {
          name: 'postgres task repository error',
          message: 'failed to create task',
          payload: arg,
          errorType: 'UNPROCESSED_ENTITY',
        };
        throw error;
      }

      return result.rows[0].task_id;
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType || 'SERVER_ERROR',
        message: (err as GeneralError).message || (err as Error).message,
        name: 'postgres task repository error',
        payload: {
          arg: arg,
        },
      } as GeneralError;
    } finally {
      client.release();
    }
  }

  async findTaskSummary(ownerID: number): Promise<TaskSummary> {
    try {
      const result = await this.pool.query(
        'select * from user_task_summary where belongs_to = $1',
        [ownerID],
      );

      if (result.rowCount === 0) {
        return {
          total_tasks: 0,
          completed_tasks: 0,
          due_today_tasks: 0,
          incomplete_tasks: 0,
          overdue_tasks: 0,
        };
      }

      return {
        total_tasks: parseInt(result.rows[0].total_tasks),
        completed_tasks: parseInt(result.rows[0].completed_tasks),
        due_today_tasks: parseInt(result.rows[0].due_today_tasks),
        incomplete_tasks: parseInt(result.rows[0].incomplete_tasks),
        overdue_tasks: parseInt(result.rows[0].overdue_tasks),
      };
    } catch (err) {
      throw {
        errorType: 'SERVER_ERROR',
        message: (err as Error).message,
        name: 'postgres task repository error',
      } as GeneralError;
    }
  }
}
