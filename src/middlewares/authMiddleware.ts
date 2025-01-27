import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token =
        req.cookies?.token || req.headers.authorization?.split(" ")[1];

    console.log(req.cookies?.token, "123", token)
    if (!token) {
        console.log('123')
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET || "default_secret";
        const payload = jwt.verify(token, secret) as { id: number; role: string };
        req.user = payload;
        console.log('2')
        next();
    } catch (error) {
        console.log(error)
        console.log('3')
        res.status(401).json({ error: "Invalid token" });
    }
};
