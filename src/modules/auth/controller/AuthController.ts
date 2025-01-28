import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { AuthService } from "../services/AuthService";
import { TYPES } from "../../../containers/container-types";
import { getErrorMessage } from "../../../utils/getErrorMessage";

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: ".herokuapp.com",
        maxAge: 30.44 * 24 * 60 * 60 * 1000, // 1 month
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: ".herokuapp.com",
        maxAge: 365.25 * 24 * 60 * 60 * 1000, // 1 year
    });
};

@injectable()
export class AuthController {
    constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

    public async register(req: Request, res: Response) {
        try {
            const { fullName, email, password } = req.body;
            const tokens = await this.authService.register(fullName, email, password);

            setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const tokens = await this.authService.login(email, password);

            // Використовуємо функцію для встановлення cookies
            setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

            res.status(200).json({ message: "Login successful" });
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

            setAuthCookies(res, newTokens.accessToken, newTokens.refreshToken);

            res.status(200).json({ message: "Token refreshed" });
        } catch (error) {
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
}
