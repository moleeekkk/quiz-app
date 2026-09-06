import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Support fallback demo token
      if (token === 'demo-jwt-token-admin-2026') {
        req.user = {
          _id: 'demo-admin-6028',
          name: 'System Admin',
          email: 'admin@quiz.com',
          role: 'admin',
        };
        return next();
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_quiz_app_2026_mca'
      );

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
      }

      return next();
    } catch (error) {
      console.error('Auth verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
