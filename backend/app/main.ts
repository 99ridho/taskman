import express, { Request, Response } from 'express';
import config from './config';
import logger from './logger';
import UserHandlers from './modules/user/http/handlers';
import PostgresUserRepository from './modules/user/repository/pg';
import { Pool } from 'pg';
import { UserUseCase } from './modules/user/usecase';
import { errorHandler } from './middlewares/errors';
import PostgresTaskRepository from './modules/task/repository/pg';
import TaskUseCase from './modules/task/usecase';
import PostgresProjectRepository from './modules/project/repository/pg';
import TaskHandlers from './modules/task/handlers';
import { jwtMiddleware } from './middlewares/jwt';
import ProjectUseCase from './modules/project/usecase';
import ProjectHandlers from './modules/project/handlers';

const app = express();
app.use(express.json());

const pool = new Pool({
  database: config.dbName,
  host: config.dbHost,
  user: config.dbUsername,
  password: config.dbPassword,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const userRepository = new PostgresUserRepository(pool);
const userUseCase = new UserUseCase(userRepository);
const userHandlers = new UserHandlers(userUseCase);

const taskRepository = new PostgresTaskRepository(pool);
const projectRepository = new PostgresProjectRepository(pool);
const taskUseCase = new TaskUseCase(taskRepository, projectRepository);
const taskHandlers = new TaskHandlers(taskUseCase);

const projectUseCase = new ProjectUseCase(projectRepository);
const projectHandlers = new ProjectHandlers(projectUseCase);

const apiRoutes = express.Router();
apiRoutes.post('/login', userHandlers.login.bind(userHandlers));
apiRoutes.post('/register', userHandlers.register.bind(userHandlers));

const tasksRoutes = express.Router();
tasksRoutes.use(jwtMiddleware);
tasksRoutes.get('/', taskHandlers.getTasks.bind(taskHandlers));
tasksRoutes.post('/', taskHandlers.createTask.bind(taskHandlers));
tasksRoutes.put('/:task_id', taskHandlers.editTask.bind(taskHandlers));
tasksRoutes.delete('/:task_id', taskHandlers.deleteTask.bind(taskHandlers));
apiRoutes.use('/tasks', tasksRoutes);

const projectsRoutes = express.Router();
projectsRoutes.use(jwtMiddleware);
projectsRoutes.get('/', projectHandlers.getProjects.bind(projectHandlers));
projectsRoutes.post('/', projectHandlers.createProject.bind(projectHandlers));
projectsRoutes.put(
  '/:project_id',
  projectHandlers.editProject.bind(projectHandlers),
);
projectsRoutes.delete(
  '/:project_id',
  projectHandlers.deleteProject.bind(projectHandlers),
);
apiRoutes.use('/projects', projectsRoutes);

app.use('/api', apiRoutes);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
