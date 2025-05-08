import { Request, Response } from 'express';
import TaskUseCase from '../usecase';
import { GeneralError } from '../../../error';

export default class TaskHandlers {
  private useCase: TaskUseCase;
  constructor(useCase: TaskUseCase) {
    this.useCase = useCase;
  }

  async createTask(req: Request, res: Response) {
    try {
      const newTaskID = await this.useCase.createTask({
        ...req.body,
        owner_id: req.user?.id,
      });

      res.status(200).json({
        data: newTaskID,
      });
    } catch (err) {
      throw err;
    }
  }

  async editTask(req: Request, res: Response) {
    try {
      const body: {
        action:
          | 'UPDATE'
          | 'MARK_COMPLETED'
          | 'MARK_INCOMPLETE'
          | 'ASSIGN_PROJECT';
        data: any;
      } = req.body;

      switch (body.action) {
        case 'UPDATE': {
          const updatedTask = await this.useCase.editTask(
            req.params.task_id,
            req.user?.id ?? 0,
            {
              ...body.data,
            },
          );

          res.status(200).json({
            data: updatedTask,
          });
          return;
        }
        case 'MARK_COMPLETED': {
          const ok = await this.useCase.changeTaskCompletionStatus(
            req.params.task_id,
            req.user?.id ?? 0,
            true,
          );

          res.status(200).json({
            data: ok,
          });
          return;
        }
        case 'MARK_INCOMPLETE': {
          const ok = await this.useCase.changeTaskCompletionStatus(
            req.params.task_id,
            req.user?.id ?? 0,
            false,
          );

          res.status(200).json({
            data: ok,
          });
          return;
        }
        case 'ASSIGN_PROJECT': {
          const ok = await this.useCase.assignTaskToProject(
            req.params.task_id,
            req.user?.id ?? 0,
            body.data.project_id,
          );

          res.status(200).json({
            data: ok,
          });
          return;
        }
        default: {
          throw {
            errorType: 'BAD_REQUEST',
            name: 'edit task handler error',
            message: 'unknown action',
            payload: body,
          } as GeneralError;
        }
      }
    } catch (err) {
      throw err;
    }
  }

  async getTasks(req: Request, res: Response) {
    try {
      const page = req.query.page as string;
      const pageSize = req.query.page_size as string;
      const result = await this.useCase.getTasks(
        req.user?.id ?? 0,
        parseInt(page),
        parseInt(pageSize),
        (req.query.sort_by as 'DUE_DATE' | 'PRIORITY' | '') ?? '',
        (req.query.sort_type as 'ASC' | 'DESC' | '') ?? '',
        (req.query.status as 'COMPLETED' | 'INCOMPLETE' | '') ?? '',
      );

      res.status(200).json(result);
    } catch (err) {
      throw err;
    }
  }

  async deleteTask(req: Request, res: Response) {
    try {
      const result = await this.useCase.deleteTask(
        req.params.task_id,
        req.user?.id ?? 0,
      );
      res.status(200).json({
        data: result,
      });
    } catch (err) {
      throw err;
    }
  }

  async getTaskSummary(req: Request, res: Response) {
    try {
      const result = await this.useCase.getTaskSummary(req.user?.id ?? 0);
      res.status(200).json({
        data: result,
      });
    } catch (err) {
      throw err;
    }
  }
}
