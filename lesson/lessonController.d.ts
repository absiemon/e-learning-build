import { Response } from 'express';
import { RequestWithUser } from '../middleware/verifyToken.ts';
export declare const areYouACreatorOfThisCourse: (user_id: string, course_id: string) => Promise<boolean>;
export declare const createLesson: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllLessons: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateLesson: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteLesson: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
