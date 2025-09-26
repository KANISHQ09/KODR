import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateTokens = (user) => {
    const payload = {
        id: user._id,
        role: user.role,
        isAdmin: user.isAdmin,
        iat: Math.floor(Date.now() / 1000)
    };

    const accessToken = jwt.sign(
        payload,
        config.jwtSecret,
        { 
            expiresIn: config.jwtExpiry || "24h", // Increased expiry time
            issuer: 'backend',
            audience: 'client'
        }
    );

    return { accessToken };
};

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, config.jwtSecret, {
            issuer: 'backend',
            audience: 'client'
        });
    } catch (error) {
        return null;
    }
};
