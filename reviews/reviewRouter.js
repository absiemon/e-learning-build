import express from 'express';
import { createReview, getReviews, updateReview, deleteReview } from './reviewController.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();
router.post('/create', verifyToken, createReview);
router.get('/get-all', getReviews);
router.put('/update/:id', verifyToken, updateReview);
router.delete('/delete/:id', verifyToken, deleteReview);
export default router;
//# sourceMappingURL=reviewRouter.js.map