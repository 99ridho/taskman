import { z, ZodError } from 'zod';
import { Task } from '../../task/domain';
import { GeneralError } from '../../../error';
import { title } from 'process';
import { ulid } from 'ulid';

class Project {
  readonly id: number;
  private _projectID: string;
  private _title: string;
  private _description: string;
  private _createdAt: Date;
  private _updatedAt?: Date;
  private _deletedAt?: Date;
  readonly ownerID?: number;

  get projectID(): string {
    return this._projectID;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
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

  constructor(
    id: number,
    projectID: string,
    title: string,
    description: string,
    createdAt: Date,
    updatedAt?: Date,
    deletedAt?: Date,
    ownerID?: number,
  ) {
    this.id = id;
    this._projectID = projectID;
    this._title = title;
    this._description = description;

    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
    this.ownerID = ownerID;
  }

  editProject(params: { title: string; description: string }) {
    if (Object.keys(params).length === 0) {
      return;
    }

    if (params.title) {
      this._title = params.title;
    }

    if (params.description) {
      this._description = params.description;
    }

    this._updatedAt = new Date();
  }

  static createProject(params: {
    title: string;
    description: string;
    owner_id: number;
  }): Project {
    try {
      const schema = z.object({
        title: z.string().nonempty('title is must be non empty'),
        description: z.string().optional(),
      });

      const parsed = schema.parse({
        title: params.title,
        description: params.description,
      });

      return new Project(
        0,
        ulid(),
        parsed.title,
        parsed.description ?? '',
        new Date(),
        undefined,
        undefined,
        params.owner_id,
      );
    } catch (err) {
      if (err instanceof ZodError) {
        throw {
          details: (err as ZodError).errors.map((e) => {
            return {
              path: e.path,
              message: e.message,
            };
          }),
          name: 'task usecase error',
          message: 'cannot create new task due to validation error',
          errorType: 'BAD_REQUEST',
        } as GeneralError;
      }

      throw err;
    }
  }
}

export default Project;
