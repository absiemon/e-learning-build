import express from 'express';
import { registerUser, loginUser, updateUser } from './userController.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/update/profile', verifyToken, updateUser);
export default router;
//# sourceMappingURL=userRouter.js.map