import AppError from '../utils/app-error.js';
import User from '../models/user.js';
import { verifyAccessToken } from '../services/auth-s.js';

export async function protect(req, res, next) {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw AppError.unauthorized('NO_TOKEN', 'You are not logged in! Please log in to get access.');
        }

        const decoded = verifyAccessToken(token);

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            throw AppError.unauthorized('USER_NOT_FOUND', 'The user belonging to this token does no longer exist.');
        }

        req.user = currentUser;
        next();
    } catch (error) {
        return res.error(error);
    }
}

export function restrictTo(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.error(
                AppError.forbidden('FORBIDDEN', 'You do not have permission to perform this action')
            );
        }
        next();
    };
}

export async function optionalAuth(req, res, next) {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            try {
                const decoded = verifyAccessToken(token);
                const currentUser = await User.findById(decoded.id);
                if (currentUser) {
                    req.user = currentUser;
                }
            } catch (err) {
                // Token không hợp lệ, bỏ qua
            }
        }

        next();
    } catch (error) {
        next();
    }
}