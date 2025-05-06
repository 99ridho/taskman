import express, { Request, Response } from 'express';
import config from './config';
import logger from './logger';
import UserHandlers from './modules/user/http/handlers';
import PostgresUserRepository from './modules/user/repository/pg';
import { Pool } from 'pg';
import { UserUseCase } from './modules/user/usecase';
import { errorHandler } from './middlewares/errors';

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

const apiRoutes = express.Router();
apiRoutes.post('/login', userHandlers.login.bind(userHandlers));
apiRoutes.post('/register', userHandlers.register.bind(userHandlers));

app.use('/api', apiRoutes);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
