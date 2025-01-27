import { Request, Response, NextFunction } from 'express';

export const responseWrapper = (req: Request, res: Response, next: NextFunction) => {
    res.success = (data: any, statusCode: number = 200, message = '') => {
        res.status(statusCode).json({
            status: 'success',
            data,
            message,
        });
    };

    res.error = (message: string, statusCode: number = 400) => {
        res.status(statusCode).json({
            status: 'error',
            message,
        });
    };

    next();
};
