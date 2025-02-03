import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const secret = process.env.JWT_SECRET || "default_secret";
        const payload = jwt.verify(token, secret) as { id: number; role: string };
        req.user = payload;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};
