import { extractTokenFromRequest } from '../utils';

const passport = require('passport');
const { Strategy } = require('passport-jwt');

passport.use(new Strategy({
  jwtFromRequest: extractTokenFromRequest,
  secretOrKey: process.env.TOKEN_HASH,
  passReqToCallback: true
}, (req, payload, done) => {
  if (payload.exp > +new Date() / 1000 - 30) {
    return done(null, {
      id: payload.userId,
      isAdmin: payload.isAdmin
    });
  }
  return done(null, false);
}));

export const addPassportMiddleware = () => passport.authenticate('jwt', { session: false });
