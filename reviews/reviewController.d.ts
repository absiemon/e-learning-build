import { Request, Response } from 'express';
import { RequestWithUser } from '../middleware/verifyToken.ts';
export declare const createReview: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getReviews: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateReview: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteReview: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
