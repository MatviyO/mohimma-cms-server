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
            await this.authService.register(fullName, email, password);

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const {user, ...tokens} = await this.authService.login(email, password);

            res.cookie("token", tokens.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none", // Важливо для крос-доменних запитів
                maxAge: 365.25 * 24 * 60 * 60 * 1000, // 1 рік
            });

            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none", // Важливо для крос-доменних запитів
                maxAge: 365.25 * 24 * 60 * 60 * 1000, // 1 рік
            });

            res.status(200).json({ message: "Login successful", data: user });
        } catch (error) {
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }

    public async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                throw new Error("Refresh token not provided");
            }

            const newTokens = await this.authService.refreshToken(refreshToken);

            this.authService.setAuthCookies(res, newTokens.accessToken, newTokens.refreshToken);

            res.status(200).json({ message: "Token refreshed" });
        } catch (error) {
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }

    public async logout(req: Request, res: Response) {
        try {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/"
            });

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/"
            });

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

}
