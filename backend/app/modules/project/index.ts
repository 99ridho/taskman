import { jwtMiddleware } from '../../middlewares/jwt';
import ProjectHandlers from './handlers';
import ProjectRepository from './repository';
import ProjectUseCase from './usecase';
import express from 'express';

export default class ProjectModule {
  private useCase: ProjectUseCase;
  private handlers: ProjectHandlers;

  constructor(repository: ProjectRepository) {
    this.useCase = new ProjectUseCase(repository);
    this.handlers = new ProjectHandlers(this.useCase);
  }

  router(): express.Router {
    const projectsRoutes = express.Router();
    projectsRoutes.use(jwtMiddleware);
    projectsRoutes.get('/', this.handlers.getProjects.bind(this.handlers));
    projectsRoutes.post('/', this.handlers.createProject.bind(this.handlers));
    projectsRoutes.put(
      '/:project_id',
      this.handlers.editProject.bind(this.handlers),
    );
    projectsRoutes.delete(
      '/:project_id',
      this.handlers.deleteProject.bind(this.handlers),
    );
    projectsRoutes.get(
      '/:project_id/tasks',
      this.handlers.getTasks.bind(this.handlers),
    );

    return projectsRoutes;
  }
}
