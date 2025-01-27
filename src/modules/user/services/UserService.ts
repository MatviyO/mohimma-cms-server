import { injectable } from "inversify";
import bcrypt from "bcrypt";
import {prisma} from "../../../../prisma/prisma-client";
import {Role} from "@prisma/client";

interface CreateUserDTO {
    fullName: string;
    email: string;
    password: string;
    role: Role;
}

interface UpdateUserDTO {
    fullName?: string;
    email?: string;
    role: Role;
    isActive?: boolean;
}

@injectable()
export class UserService {
    public async getUsers() {
        return prisma.user.findMany();
    }

    public async getUserById(id: number) {
        return prisma.user.findUnique({where: {id}});
    }

    public async createUser(data: CreateUserDTO) {
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new Error("User with this email already exists.");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        return prisma.user.create({
            data: {...data, password: hashedPassword},
        });
    }

    public async updateUser(id: number, data: UpdateUserDTO) {
        if (data.role && !Object.values(Role).includes(data.role)) {
            throw new Error(`Invalid role: ${data.role}`);
        }

        return prisma.user.update({
            where: { id },
            data,
        });
    }

    public async deleteUser(id: number) {
        await prisma.user.delete({ where: { id } });
    }

    public async activateUser(id: number) {
        return prisma.user.update({
            where: {id},
            data: {isActive: true},
        });
    }
}
