import { Request, Response } from 'express';
import { RequestWithUser } from '../middleware/verifyToken.ts';
export declare const createCourse: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getCourse: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllCourse: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllAvailableCourse: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateCourse: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteCourse: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
