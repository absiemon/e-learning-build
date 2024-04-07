import express from 'express';
import { enrollInCourse, getAllEnrolledCourse, getAllUserEnrolledInCourse } from './enrollmentController.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();
router.post('/enroll', verifyToken, enrollInCourse);
router.get('/all-courses', verifyToken, getAllEnrolledCourse);
router.get('/all-users', getAllUserEnrolledInCourse);
export default router;
//# sourceMappingURL=enrollmentRouter.js.map