import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { AuthService } from "../services/AuthService";
import { TYPES } from "../../../containers/container-types";
import { getErrorMessage } from "../../../utils/getErrorMessage";

@injectable()
export class AuthController {
    constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

    public async register(req: Request, res: Response) {
        try {
            const { fullName, email, password } = req.body;
            const tokens = await this.authService.register(fullName, email, password);

            // Set cookies for tokens
            res.cookie("token", tokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 30.44 * 24 * 60 * 60 * 1000, // 1 month
            });
            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 365.25 * 24 * 60 * 60 * 1000, // 1 year
            });

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const tokens = await this.authService.login(email, password);

            // Set cookies for tokens
            res.cookie("token", tokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 30.44 * 24 * 60 * 60 * 1000, // 1 month
            });
            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 365.25 * 24 * 60 * 60 * 1000, // 1 year
            });

            res.status(200).json({ message: "Login successful" });
        } catch (error) {
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }

    public async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.cookies; // Get refresh token from cookies
            if (!refreshToken) {
                throw new Error("Refresh token not provided");
            }

            const newTokens = await this.authService.refreshToken(refreshToken);

            // Update cookies with new tokens
            res.cookie("token", newTokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 1000, // 1 hour
            });
            res.cookie("refreshToken", newTokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(200).json({ message: "Token refreshed" });
        } catch (error) {
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
}
