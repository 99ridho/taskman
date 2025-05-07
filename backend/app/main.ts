import express from 'express';
import config from './config';
import PostgresUserRepository from './modules/user/repository/pg';
import { Pool } from 'pg';
import { errorHandler } from './middlewares/errors';
import PostgresTaskRepository from './modules/task/repository/pg';
import PostgresProjectRepository from './modules/project/repository/pg';
import UserModule from './modules/user';
import TaskModule from './modules/task';
import ProjectModule from './modules/project';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

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
const taskRepository = new PostgresTaskRepository(pool);
const projectRepository = new PostgresProjectRepository(pool);

const userModule = new UserModule(userRepository);
const taskModule = new TaskModule(taskRepository, projectRepository);
const projectModule = new ProjectModule(projectRepository);

const apiRoutes = express.Router();
apiRoutes.use('/', userModule.router());
apiRoutes.use('/tasks', taskModule.router());
apiRoutes.use('/projects', projectModule.router());

app.use('/api', apiRoutes);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
