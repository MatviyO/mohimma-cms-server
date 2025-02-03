import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { AuthService } from "../services/AuthService";
import { TYPES } from "../../../containers/container-types";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import {prisma} from "../../../../prisma/prisma-client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

@injectable()
export class AuthController {
    private readonly jwtSecret = process.env.JWT_SECRET || 'default_secret';
    private readonly refreshSecret = process.env.REFRESH_SECRET || 'default_refresh_secret';
    private readonly tokenExpiry = '1y';
    private readonly refreshExpiry = '1y';

    constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

    public async register(req: Request, res: Response) {
        try {
            const { fullName, email, password } = req.body;
            await this.authService.register(fullName, email, password);

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                res.status(400).json({ error: "Invalid email or password" });
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
               res.status(400).json({ error: "Invalid email or password" });
                return;
            }

            const { password: _, ...userData } = user;
            const tokens = this.generateTokens(user);

            res.status(200).json({
                message: "Login successful",
                user: userData,
                ...tokens
            });
        } catch (error) {
            res.status(500).json({ error: getErrorMessage(error) });
        }
    }

    public async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({ error: "Refresh token is required" });
                return;
            }

            const decoded = jwt.verify(refreshToken, this.refreshSecret) as { id: number };
            const user = await prisma.user.findUnique({ where: { id: decoded.id } });

            if (!user) {
                res.status(401).json({ error: "Invalid refresh token" });
                return;
            }

            const newTokens = this.generateTokens(user);

            res.status(200).json(newTokens);
        } catch (error) {
            res.status(401).json({ error: "Invalid refresh token" });
        }
    }

    public async logout(req: Request, res: Response) {
        try {
            res.status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }


    public async me(req: Request, res: Response) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
            }

            const user = await this.authService.getUserById(Number(userId));

            if (!user) {
                res.status(404).json({ error: "User not found" });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch user data" });
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

        return { accessToken, refreshToken };
    }

}
