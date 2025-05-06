import z, { ZodError } from 'zod';
import Project from '../../project/domain';
import { GeneralError } from '../../../error';
import { ulid } from 'ulid';

export enum TaskPriority {
  LOW = 1,
  MEDIUM,
  HIGH,
  CRITICAL,
}

export class Task {
  readonly id: number;
  private _taskID: string;
  private _title: string;
  private _description: string;
  private _priority: TaskPriority;
  private _isCompleted: boolean;
  private _dueDate?: Date;
  private _createdAt: Date;
  private _updatedAt?: Date;
  private _deletedAt?: Date;
  private _assignedProject?: Project;
  readonly ownerID?: number;

  get taskID(): string {
    return this._taskID;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get priority(): TaskPriority {
    return this._priority;
  }

  get isCompleted(): boolean {
    return this._isCompleted;
  }

  get dueDate(): Date | undefined {
    return this._dueDate;
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

  get assignedProject(): Project | undefined {
    return this._assignedProject;
  }

  constructor(
    id: number,
    taskID: string,
    title: string,
    description: string,
    priority: TaskPriority,
    isCompleted: boolean = false,
    dueDate?: Date,
    ownerID?: number,
  ) {
    this.id = id;
    this._taskID = taskID;
    this._title = title;
    this._description = description;
    this._priority = priority;
    this._isCompleted = isCompleted;
    this._dueDate = dueDate;
    this._createdAt = new Date();
    this.ownerID = ownerID;
  }

  markAsCompleted() {
    this._isCompleted = true;
    this._updatedAt = new Date();
  }

  markAsIncomplete() {
    this._isCompleted = false;
    this._updatedAt = new Date();
  }

  assignToProject(project: Project) {
    this._assignedProject = project;
    this._updatedAt = new Date();
  }

  editTask(params: {
    title: string;
    description: string;
    priority: TaskPriority;
    due_date: string;
  }) {
    if (Object.keys(params).length === 0) {
      return;
    }

    if (params.title) {
      this._title = params.title;
    }

    if (params.description) {
      this._description = params.description;
    }

    if (params.priority) {
      this._priority = params.priority;
    }

    if (params.due_date) {
      this._dueDate = new Date(params.due_date);
    }

    this._updatedAt = new Date();
  }

  static createTask(params: {
    title: string;
    description?: string;
    priority: TaskPriority;
    due_date?: string;
    owner_id: number;
  }): Task {
    try {
      const schema = z.object({
        title: z.string().nonempty('title is must be non empty'),
        description: z.string().optional(),
        priority: z.number().nonnegative().gt(0),
        due_date: z.string().datetime().optional(),
      });

      const parsed = schema.parse({
        title: params.title,
        description: params.description,
        priority: params.priority,
        due_date: params.due_date,
      });

      return new Task(
        0,
        ulid(),
        parsed.title,
        parsed.description ?? '',
        parsed.priority,
        false,
        parsed.due_date ? new Date(parsed.due_date) : undefined,
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
