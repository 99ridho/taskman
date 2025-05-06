import { Pool } from 'pg';
import ProjectRepository from '.';
import { ProjectDTO } from '../dto';
import { GeneralError } from '../../../error';

export default class PostgresProjectRepository implements ProjectRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findProjectByProjectID(projectID: string): Promise<ProjectDTO> {
    try {
      const query =
        'SELECT * FROM projects WHERE project_id = $1 AND deleted_at IS NULL';
      const values = [projectID];
      const result = await this.pool.query(query, values);

      if (result.rows.length === 0) {
        const error: GeneralError = {
          name: 'postgres project repository error',
          message: 'project not found',
          payload: {
            project_id: projectID,
          },
          errorType: 'NOT_FOUND',
        };
        throw error;
      }

      const proj = result.rows[0];

      return {
        id: proj.id,
        description: proj.description,
        project_id: proj.project_id,
        title: proj.title,
        created_at: proj.created_at,
        updated_at: proj.updated_at,
        deleted_at: proj.deleted_at,
        owner_id: proj.belongs_to,
      };
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType || 'SERVER_ERROR',
        message: (err as GeneralError).message || (err as Error).message,
        name: 'postgres project repository error',
        payload: {
          project_id: projectID,
        },
      } as GeneralError;
    }
  }

  async findProjectByID(id: number): Promise<ProjectDTO> {
    try {
      const query =
        'SELECT * FROM projects WHERE id = $1 AND deleted_at IS NULL';
      const values = [id];
      const result = await this.pool.query(query, values);

      if (result.rows.length === 0) {
        const error: GeneralError = {
          name: 'postgres project repository error',
          message: 'project not found',
          payload: {
            id: id,
          },
          errorType: 'NOT_FOUND',
        };
        throw error;
      }

      const proj = result.rows[0];

      return {
        id: proj.id,
        description: proj.description,
        project_id: proj.project_id,
        title: proj.title,
        created_at: proj.created_at,
        updated_at: proj.updated_at,
        deleted_at: proj.deleted_at,
        owner_id: proj.belongs_to,
      };
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType || 'SERVER_ERROR',
        message: (err as GeneralError).message || (err as Error).message,
        name: 'postgres project repository error',
        payload: {
          id: id,
        },
      } as GeneralError;
    }
  }

  async findAllProjects(
    limit: number,
    offset: number,
  ): Promise<[ProjectDTO[], number]> {
    try {
      const query =
        'SELECT * FROM projects WHERE deleted_at IS NULL ORDER BY id LIMIT $1 OFFSET $2';
      const values = [limit, offset];
      const result = await this.pool.query(query, values);

      const totalRecordsResult = await this.pool.query(
        'select count(id)::int as cnt from projects where deleted_at is null',
      );

      const data = result.rows.map((proj) => {
        return {
          id: proj.id,
          description: proj.description,
          project_id: proj.project_id,
          title: proj.title,
          created_at: proj.created_at,
          updated_at: proj.updated_at,
          deleted_at: proj.deleted_at,
          owner_id: proj.belongs_to,
        };
      });

      return [data, totalRecordsResult.rows[0].cnt as number];
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType || 'SERVER_ERROR',
        message: (err as GeneralError).message || (err as Error).message,
        name: 'postgres project repository error',
        payload: {
          limit: limit,
          offset: offset,
        },
      } as GeneralError;
    }
  }

  async updateProjectByProjectID(
    projectID: string,
    arg: ProjectDTO,
  ): Promise<ProjectDTO> {
    try {
      const query = `
      UPDATE projects 
      SET title = $1, description = $2, updated_at = NOW()
      WHERE project_id = $3
      RETURNING *
    `;
      const values = [arg.title, arg.description, projectID];
      const result = await this.pool.query(query, values);

      if (result.rows.length === 0) {
        const error: GeneralError = {
          name: 'postgres project repository error',
          message: 'project not found',
          payload: {
            arg: arg,
            project_id: projectID,
          },
          errorType: 'NOT_FOUND',
        };
        throw error;
      }

      const proj = result.rows[0];
      return {
        id: proj.id,
        description: proj.description,
        project_id: proj.project_id,
        title: proj.title,
        created_at: proj.created_at,
        updated_at: proj.updated_at,
        deleted_at: proj.deleted_at,
        owner_id: proj.belongs_to,
      };
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType || 'SERVER_ERROR',
        message: (err as GeneralError).message || (err as Error).message,
        name: 'postgres project repository error',
        payload: {
          project_id: projectID,
          arg: arg,
        },
      } as GeneralError;
    }
  }

  async deleteProjectByProjectID(projectID: string): Promise<boolean> {
    try {
      const query = `
      UPDATE projects 
      SET deleted_at = NOW() 
      WHERE project_id = $1
      RETURNING id
    `;
      const values = [projectID];
      const result = await this.pool.query(query, values);

      return result.rows.length > 0;
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType || 'SERVER_ERROR',
        message: (err as GeneralError).message || (err as Error).message,
        name: 'postgres project repository error',
        payload: {
          project_id: projectID,
        },
      } as GeneralError;
    }
  }

  async createProject(arg: ProjectDTO): Promise<string> {
    try {
      const query = `
      INSERT INTO projects (project_id, title, description, belongs_to) 
      VALUES ($1, $2, $3, $4)
      RETURNING project_id
    `;
      const values = [arg.project_id, arg.title, arg.description, arg.owner_id];
      const result = await this.pool.query(query, values);

      return result.rows[0].project_id;
    } catch (err) {
      throw {
        errorType: (err as GeneralError).errorType || 'SERVER_ERROR',
        message: (err as GeneralError).message || (err as Error).message,
        name: 'postgres project repository error',
        payload: {
          arg: arg,
        },
      } as GeneralError;
    }
  }
}
