import jwt from 'jsonwebtoken';
export const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
//# sourceMappingURL=verifyToken.js.map