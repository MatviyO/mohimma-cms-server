import { Router } from 'express';
import container from "../../../containers/inversify.config";
import {AuthController} from "./AuthController";
import {TYPES} from "../../../containers/container-types";
import {authMiddleware} from "../../../middlewares/authMiddleware";

const authController = container.get<AuthController>(TYPES.AuthController);

const authRouter = Router();

authRouter.post('/register', authController.register.bind(authController));
authRouter.post('/login', authController.login.bind(authController));
authRouter.post('/refresh-token', authController.refreshToken.bind(authController));

authRouter.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'You have access!' });
});

export default authRouter;
