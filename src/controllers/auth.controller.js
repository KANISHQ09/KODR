import crypto from 'crypto';
import { findOneUser, createUser, findUserById, getAllUsers, updateUser } from '../dao/user.dao.js';
import { generateTokens } from "../utils/jwt.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { sanitizeUser } from "../utils/sanitizer.js";
import config from '../config/config.js';

// -------------------- Local Registration --------------------
export const registerUserController = async (req, res, next) => {
    try {
        const { username, email, password, adminCode = null } = req.body;

        // Check if user exists
        const userExists = await findOneUser({
            $or: [
                { email: email.toLowerCase() },
                { username: { $regex: new RegExp(`^${username}$`, 'i') } }
            ]
        });

        if (userExists) {
            return res.status(409).json({
                message: 'User already exists',
                success: false
            });
        }

        const hashedPassword = await hashPassword(password);

        // Determine role: only 'admin' or 'user'
        const role = (adminCode === config.ADMIN_SECRET_CODE) ? 'admin' : 'user';

        const userData = {
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password,
            role,
            lastLogin: new Date(),
        };

        const user = await createUser(userData);

        const { accessToken } = generateTokens(user);

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        return res.status(201).json({
            message: 'User registered successfully',
            success: true,
            user: sanitizeUser(user)
        });

    } catch (error) {
        next(error);
    }
};

// -------------------- Local Login --------------------
export const loginUserController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await findOneUser({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials',
                success: false
            });
        }

        const isValidPassword = await comparePassword(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({
                message: 'Invalid credentials',
                success: false
            });
        }

        const { accessToken } = generateTokens(user);

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        return res.status(200).json({
            message: 'Login successful',
            success: true,
            user: sanitizeUser(user)
        });

    } catch (error) {
        next(error);
    }
};

// -------------------- Logout --------------------
export const logoutUserController = async (req, res, next) => {
    try {
        const userId = req.id;

        if (userId) {
            await updateUser(userId); // clear tokens if any
        }

        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict'
        });

        return res.status(200).json({
            message: 'Logged out successfully',
            success: true
        });

    } catch (error) {
        next(error);
    }
};

// -------------------- Get All Users (Admin Only) --------------------
export const getAllUsersController = async (req, res, next) => {
    try {
        const { page, limit, sort } = req.query;

        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sort: sort ? JSON.parse(sort) : { createdAt: -1 }
        };

        const result = await getAllUsers(options);

        return res.status(200).json({
            message: 'Users retrieved successfully',
            success: true,
            data: result.users,
            pagination: result.pagination
        });

    } catch (error) {
        next(error);
    }
};

// -------------------- Helper: Google OAuth --------------------
export const googleAuthController = (req, res, next) => {
    // Handled by Passport.js Google strategy
    next();
};

export const googleRedirectController = async (req, res, next) => {
    try {
        const googleUser = req.user; // populated by Passport

        // Extract profile data safely
        const googleId = googleUser?.id;
        const displayName = googleUser?.displayName || 'User';
        const email = googleUser?.emails?.[0]?.value;

        if (!googleId || !email) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Google profile data'
            });
        }

        // Find or create local user mapped to Google account
        let user = await findOneUser({ googleId });
        if (!user) {
            user = await createUser({
                username: displayName,
                email,
                googleId,
                provider: 'google',
                role: 'user',
                lastLogin: new Date(),
            });
        }

        // Issue JWT using existing helper for consistency
        const { accessToken } = generateTokens(user);

        // Redirect with token in query (SPA-friendly)
        return res.redirect(`${config.CLIENT_URL}/?token=${accessToken}`);
    } catch (error) {
        next(error);
    }
};


