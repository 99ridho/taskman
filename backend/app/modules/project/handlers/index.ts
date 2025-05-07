import { Request, Response } from 'express';
import ProjectUseCase from '../usecase';

export default class ProjectHandlers {
  private useCase: ProjectUseCase;
  constructor(useCase: ProjectUseCase) {
    this.useCase = useCase;
  }

  async createProject(req: Request, res: Response) {
    try {
      const newTaskID = await this.useCase.createProject({
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

  async getProjects(req: Request, res: Response) {
    try {
      const page = req.query.page as string;
      const pageSize = req.query.page_size as string;
      const result = await this.useCase.getProjects(
        req.user?.id ?? 0,
        parseInt(page),
        parseInt(pageSize),
      );

      res.status(200).json(result);
    } catch (err) {
      throw err;
    }
  }

  async deleteProject(req: Request, res: Response) {
    try {
      const result = await this.useCase.deleteProject(
        req.params.project_id,
        req.user?.id ?? 0,
      );
      res.status(200).json({
        data: result,
      });
    } catch (err) {
      throw err;
    }
  }

  async editProject(req: Request, res: Response) {
    try {
      const updatedTask = await this.useCase.editProject(
        req.params.project_id,
        req.user?.id ?? 0,
        {
          ...req.body,
        },
      );

      res.status(200).json({
        data: updatedTask,
      });
    } catch (err) {
      throw err;
    }
  }
}
