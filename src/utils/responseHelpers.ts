import { Response } from "express";

const handleUserNotFound = (res: Response, message: string, statusCode: number) => {
    return res.status(statusCode).json({
        success: false,
        result: message,
        status: statusCode,
        message,
    });
};

export {handleUserNotFound}