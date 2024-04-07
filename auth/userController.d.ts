import { Request, Response } from 'express';
import { RequestWithUser } from '../middleware/verifyToken.ts';
export declare const registerUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const loginUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateUser: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
