import express from 'express';
import { createVideo, updateVideo, deleteVideo } from './videoController.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();
router.post('/create', verifyToken, createVideo);
router.put('/update/:id', verifyToken, updateVideo);
router.delete('/delete', verifyToken, deleteVideo);
export default router;
//# sourceMappingURL=videoRouter.js.map