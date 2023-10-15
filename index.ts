import express, { Express, Request, Response , Application } from 'express';
import { redisClient } from './config/redis/cache';
import dotenv from 'dotenv';
import { router } from './routes/user.routes';
import morgan from 'morgan';
import { prisma } from './config/postgres/postgres';
//For env File 
dotenv.config();

const app: Application = express();


// @connectors
const postgresClient = async () => {
  try {
    await prisma.$connect();
    console.log("connected to PostgreSQL database");
    return prisma;
  } catch (error) {
    console.error("Error connecting to PostgreSQL database:", error);
    throw error; 
  }
}
postgresClient()
  .then((prismaInstance) => {
    console.log("Prisma is connected to the database");
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

// caching Server
const cacheServer = async () => {
  try {
    await redisClient.connect()
    console.log('Connected to Redis server');
  }catch(error) {
    console.log('failed to connect redis server: ',error)
  }
}
cacheServer()

// @middlewares
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
      message: "NAuth REST server",
      health: "ok"
  })
})

app.use('/api', router)

export default app;