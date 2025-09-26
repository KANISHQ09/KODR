import express from "express";
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
// Passport (Google OAuth)
import passport from 'passport';
import './config/passport.js'; // registers Google strategy


// Import Config
import config from './config/config.js';

// Import Routes


// Import Middleware
import { errorHandler } from './middlewares/error.handler.js';
import { apiLimiter } from "./middlewares/ratelimit.middleware.js";


// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: config.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(apiLimiter);
app.use(passport.initialize());


// Routes
import authRouter from './routes/auth.route.js';

// Routes
app.use('/api/auth', authRouter);

app.get('/auth/google/callback', (req, res) => {
    const qs = new URLSearchParams(req.query).toString();
    res.redirect(307, `/api/auth/google/callback${qs ? `?${qs}` : ''}`);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'EMS Backend is running' });
});

// Error handling
app.use(errorHandler);



export default app;