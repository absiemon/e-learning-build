import express from 'express';
import authRouter from './auth/userRouter.js';
import courseRouter from './course/courseRouter.js';
import reviewRouter from './reviews/reviewRouter.js';
import lessonRouter from './lesson/lessonRouter.js';
import videoRouter from './video/videoRouter.js';
import enrollmentRouter from './enrollment/enrollmentRouter.js';
const router = express.Router();
router.use('/auth', authRouter);
router.use('/course', courseRouter);
router.use('/review', reviewRouter);
router.use('/lesson', lessonRouter);
router.use('/video', videoRouter);
router.use('/enrollment', enrollmentRouter);
export default router;
//# sourceMappingURL=indexRoute.js.map