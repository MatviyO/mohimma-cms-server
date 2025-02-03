import 'reflect-metadata';
import express, {Express} from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import expressWinston from 'express-winston';
import cookieParser from 'cookie-parser';

import logger from './logger/winstonLogger';
import container from './containers/inversify.config';
import {DatabaseService} from "./modules/db/DatabaseService";
import {TYPES} from "./containers/container-types";

import {prisma} from "../prisma/prisma-client";
import authRouter from "./modules/auth/controller/AuthRoute";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './containers/swaggerConfig';
import {responseWrapper} from "./middlewares/responseWrapperMiddleware";
import userRouter from "./modules/user/controller/UserRotue";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const specs = swaggerJsdoc(swaggerOptions);

const isProduction = process.env.NODE_ENV === 'production';
const clientUrl = isProduction ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_LOCAL;

// Middleware
app.use('/api/swagger-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cookieParser());
app.use(
    cors({
        origin: 'https://mohimma-cms.vercel.app',
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
    })
);
app.use(express.json());
app.use(expressWinston.logger({ winstonInstance: logger }));
app.use(expressWinston.errorLogger({ winstonInstance: logger }));
app.use(responseWrapper);

const databaseConnection = container.get<DatabaseService>(TYPES.DatabaseService);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`);
    try {
        await databaseConnection.connect();
    } catch (error) {
        console.error('Failed to connect to database:', (error as Error).message);
    }
});

process.on('SIGINT', async () => {
    console.log('Closing server...');
    await prisma.$disconnect();
    process.exit(0);
});

export default app;
