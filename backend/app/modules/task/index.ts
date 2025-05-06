import { jwtMiddleware } from '../../middlewares/jwt';
import ProjectRepository from '../project/repository';
import TaskHandlers from './handlers';
import TaskRepository from './repository';
import TaskUseCase from './usecase';
import express from 'express';

export default class TaskModule {
  private useCase: TaskUseCase;
  private handlers: TaskHandlers;

  constructor(
    taskRepository: TaskRepository,
    projectRepository: ProjectRepository,
  ) {
    this.useCase = new TaskUseCase(taskRepository, projectRepository);
    this.handlers = new TaskHandlers(this.useCase);
  }

  router(): express.Router {
    const tasksRoutes = express.Router();
    tasksRoutes.use(jwtMiddleware);
    tasksRoutes.get('/', this.handlers.getTasks.bind(this.handlers));
    tasksRoutes.post('/', this.handlers.createTask.bind(this.handlers));
    tasksRoutes.put('/:task_id', this.handlers.editTask.bind(this.handlers));
    tasksRoutes.delete(
      '/:task_id',
      this.handlers.deleteTask.bind(this.handlers),
    );

    return tasksRoutes;
  }
}
