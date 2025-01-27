import { Router } from "express";
import container from "../../../containers/inversify.config";
import { TYPES } from "../../../containers/container-types";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { UserController } from "./UserController";
import { asyncHandler } from "../../../utils/asyncHandler";

const userController = container.get<UserController>(TYPES.UserController);

const userRouter = Router();

// Protected routes
userRouter.get("", authMiddleware, asyncHandler(userController.getUsers.bind(userController)));
userRouter.post("", authMiddleware, asyncHandler(userController.createUser.bind(userController)));
userRouter.get("/:id", authMiddleware, asyncHandler(userController.getUserById.bind(userController)));
userRouter.put("/:id", authMiddleware, asyncHandler(userController.updateUser.bind(userController)));
userRouter.delete("/:id", authMiddleware, asyncHandler(userController.deleteUser.bind(userController)));
userRouter.patch("/:id/activate", authMiddleware, asyncHandler(userController.activateUser.bind(userController)));

export default userRouter;
