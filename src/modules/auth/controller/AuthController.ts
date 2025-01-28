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

            this.authService.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const tokens = await this.authService.login(email, password);

            this.authService.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

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

            this.authService.setAuthCookies(res, newTokens.accessToken, newTokens.refreshToken);

            res.status(200).json({ message: "Token refreshed" });
        } catch (error) {
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
}
