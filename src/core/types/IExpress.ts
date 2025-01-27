declare namespace Express {
    export interface Request {
        user?: {
            id: number;
            role: string;
        };
    }

    export interface Response {
        success: (data: any, statusCode?: number, message?: string) => void;
        error: (message: string, statusCode?: number) => void;
    }
}
