import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  secretKey: string;
  dbUsername: string;
  dbHost: string;
  dbPassword: string;
  dbName: string;
  dbPort: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  secretKey: process.env.SECRET_KEY || '',
  dbUsername: process.env.DB_USERNAME || '',
  dbHost: process.env.DB_HOST || '',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || '',
  dbPort: process.env.DB_PORT || '',
};

export default config;
