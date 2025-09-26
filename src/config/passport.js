import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from './config.js';

// Use env directly so we don't force these keys into app config
const {
    googleCallbackURL,
    googleClientId,
    googleClientSecret,
} = config;

passport.use(
    new GoogleStrategy(
        {
            clientID: googleClientId,
            clientSecret: googleClientSecret,
            callbackURL: googleCallbackURL,
        },
        (accessToken, refreshToken, profile, done) => {
            // We pass the Google profile along; controller will upsert user and mint JWT
            return done(null, profile);
        }
    )
);

// No sessions used; we only need the user object once at callback
export default passport;