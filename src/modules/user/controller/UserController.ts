import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { UserService } from "../services/UserService";
import { TYPES } from "../../../containers/container-types";

@injectable()
export class UserController {
    constructor(@inject(TYPES.UserService) private userService: UserService) {}

    public async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.getUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch users." });
        }
    }

    public async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(Number(id));
            if (!user) {
                res.status(404).json({ error: "User not found." });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch user." });
        }
    }

    public async createUser(req: Request, res: Response): Promise<void> {
        try {
            const { fullName, email, password, role } = req.body;
            const newUser = await this.userService.createUser({
                fullName,
                email,
                password,
                role,
            });
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: "Failed to create user." });
        }
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { fullName, email, role, isActive } = req.body;

            const updatedUser = await this.userService.updateUser(Number(id), {
                fullName,
                email,
                role,
                isActive,
            });

            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: "Failed to update user." });
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.userService.deleteUser(Number(id));
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Failed to delete user." });
        }
    }

    public async activateUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updatedUser = await this.userService.activateUser(Number(id));
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: "Failed to activate user." });
        }
    }
}
