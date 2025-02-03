import { Request, Response, NextFunction } from "express";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== "ADMIN") {
        res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
};
