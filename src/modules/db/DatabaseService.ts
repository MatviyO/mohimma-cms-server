import { injectable } from 'inversify';
// @ts-ignore
import {prisma} from "../../../prisma/prisma-client";

@injectable()
export class DatabaseService {
    public async connect() {
        try {
            await prisma.$connect();
            console.log('Database connected');
        } catch (error) {
            console.error('Failed to connect to the database:', error);
            throw error;
        }
    }

    public async disconnect() {
        await prisma.$disconnect();
        console.log('Database disconnected');
    }
}
