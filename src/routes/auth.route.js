import express from 'express';
import {
    registerUserController,
    loginUserController,
    logoutUserController,
    getAllUsersController,       // new for Google login
    googleRedirectController    // callback handler
} from '../controllers/auth.controller.js';
import { authLimiter, apiLimiter } from "../middlewares/ratelimit.middleware.js";
import { registerValidator, loginValidator } from '../middlewares/validator.middleaware.js';
import { requireAuth, requireAdmin, permit } from '../middlewares/auth.middleware.js';
import passport from 'passport';
import config from '../config/config.js';

const router = express.Router();

// ----------------- Public Routes -----------------

// Local registration
router.post(
    '/register',
    registerValidator,
    authLimiter,
    registerUserController
);

// Local login
router.post(
    '/login',
    loginValidator,
    authLimiter,
    loginUserController
);

// Google OAuth login
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${config.CLIENT_URL}/login` }),
    googleRedirectController
);

// ----------------- Protected Routes -----------------

// Logout
router.post(
    '/logout',
    requireAuth,
    logoutUserController
);

// Get all users (admin only)
router.get(
    '/users',
    apiLimiter,
    requireAuth,
    requireAdmin,      // only admin can access
    getAllUsersController
);

// Example of role-based route (admin or user)
router.get(
    '/profile',
    requireAuth,
    permit('admin', 'user'), // accessible by both roles
    (req, res) => {
        res.json({
            message: `Welcome ${req.user.role}`,
            user: req.user
        });
    }
);

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Auth Service',
        timestamp: new Date().toISOString()
    });
});

export default router;
