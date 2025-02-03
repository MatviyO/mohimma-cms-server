import { Router } from "express";
import container from "../../../containers/inversify.config";
import { TYPES } from "../../../containers/container-types";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { UserController } from "./UserController";
import { asyncHandler } from "../../../utils/asyncHandler";
import {adminMiddleware} from "../../../middlewares/adminMiddleware";

const userController = container.get<UserController>(TYPES.UserController);

const userRouter = Router();

// Protected routes
userRouter.get("", authMiddleware, adminMiddleware, asyncHandler(userController.getUsers.bind(userController)));
userRouter.post("", authMiddleware, adminMiddleware, asyncHandler(userController.createUser.bind(userController)));
userRouter.get("/:id", authMiddleware, adminMiddleware, asyncHandler(userController.getUserById.bind(userController)));
userRouter.put("/:id", authMiddleware, adminMiddleware, asyncHandler(userController.updateUser.bind(userController)));
userRouter.delete("/:id", authMiddleware, adminMiddleware, asyncHandler(userController.deleteUser.bind(userController)));
userRouter.patch("/:id/activate", authMiddleware, adminMiddleware, asyncHandler(userController.activateUser.bind(userController)));

export default userRouter;
