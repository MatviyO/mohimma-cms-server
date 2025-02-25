import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../prisma/prisma-client';
import {Response} from "express";

@injectable()
export class AuthService {
    private readonly jwtSecret = process.env.JWT_SECRET || 'default_secret';
    private readonly refreshSecret = process.env.REFRESH_SECRET || 'default_refresh_secret';
    private readonly tokenExpiry = '1h';
    private readonly refreshExpiry = '7d';

    public async register(fullName: string, email: string, password: string) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
            },
        });

        return this.generateTokens(user);
    }

    public async login(email: string, pass: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (!user.isActive) {
            throw new Error('Your account is not activated. Please contact an administrator.');
        }

        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        const {password, ...currentUser} = user;

        return {...this.generateTokens(user), user: currentUser};
    }

    public async refreshToken(token: string) {
        try {
            const decoded = jwt.verify(token, this.refreshSecret) as { id: number };
            const user = await prisma.user.findUnique({ where: { id: decoded.id } });
            if (!user || user.refreshToken !== token) {
                throw new Error('Invalid refresh token');
            }

            return this.generateTokens(user);
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    private generateTokens(user: { id: number; email: string; role: string }) {
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            this.jwtSecret,
            { expiresIn: this.tokenExpiry }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            this.refreshSecret,
            { expiresIn: this.refreshExpiry }
        );

        prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        return { accessToken, refreshToken };
    }

    public setAuthCookies(res: Response, accessToken: string, refreshToken: string){
        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 365.25 * 24 * 60 * 60 * 1000, // 1 year
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 365.25 * 24 * 60 * 60 * 1000, // 1 year
        });
    };

    public async getUserById(userId: number) {
        return prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }
}
