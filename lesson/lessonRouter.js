import express from 'express';
import { createLesson, getAllLessons, updateLesson, deleteLesson } from './lessonController.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();
router.post('/create', verifyToken, createLesson);
router.get('/get-all', verifyToken, getAllLessons);
router.put('/update/:id', verifyToken, updateLesson);
router.delete('/delete', verifyToken, deleteLesson);
export default router;
//# sourceMappingURL=lessonRouter.js.map