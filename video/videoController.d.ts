import { Response } from 'express';
import { RequestWithUser } from '../middleware/verifyToken.ts';
export declare const createVideo: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateVideo: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteVideo: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>>>;
