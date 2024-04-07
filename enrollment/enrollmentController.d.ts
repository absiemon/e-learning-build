import { Request, Response } from 'express';
import { RequestWithUser } from '../middleware/verifyToken.ts';
export declare const enrollInCourse: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllEnrolledCourse: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllUserEnrolledInCourse: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
