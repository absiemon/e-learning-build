/// <reference types="cookie-parser" />
import { Request, Response, NextFunction } from 'express';
interface TokenPayload {
    id: string;
    email: string;
    username: string;
}
export interface RequestWithUser extends Request {
    user?: TokenPayload;
}
export declare const verifyToken: (req: RequestWithUser, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
