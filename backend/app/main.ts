import express, { Request, Response } from 'express';
import { errorHandler } from './middlewares/errors';
import config from './config';
import logger from './logger';

const app = express();
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  logger.info('path accessed', {
    path: '/',
    timestamp: new Date().toISOString(),
  });
  res.json({
    status: 'ok',
  });
});

// Global error handler (should be after routes)
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
