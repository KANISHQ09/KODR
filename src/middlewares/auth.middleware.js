import { verifyAccessToken } from "../utils/jwt.js";
import { findUserById } from "../dao/user.dao.js";

// ✅ Middleware: Authenticate user
export const requireAuth = async (req, res, next) => {
    try {
        const token = extractAccessToken(req);

        if (!token) {
            return res.status(401).json({
                message: "Token required",
                success: false,
            });
        }

        const payload = verifyAccessToken(token);
        if (!payload) {
            return res.status(401).json({
                message: "Invalid or expired token",
                success: false,
            });
        }

        // Fetch only id + role
        const user = await findUserById(payload.id, "role");
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false,
            });
        }

        // Attach user info
        req.user = {
            id: payload.id,
            role: user.role, // only 'admin' or 'user'
        };

        req.token = token;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Authentication failed",
            success: false,
        });
    }
};

// ✅ Middleware: Admin only
export const requireAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required",
            success: false,
        });
    }
    next();
};

// ✅ Middleware: Role-based authorization
export const permit = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
                success: false,
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Insufficient permissions",
                success: false,
            });
        }

        next();
    };
};

// 🔹 Helper: Extract access token
const extractAccessToken = (req) => {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith("Bearer ")) {
        return auth.split(" ")[1];
    }

    if (req.cookies?.token) {
        return req.cookies.token;
    }

    return null;
};
