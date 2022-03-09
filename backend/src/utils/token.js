import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const AUTH_HEADER = 'authorization';
const BEARER_AUTH_SCHEME = 'bearer';

const parseAuthHeader = (hdrValue) => {
  if (typeof hdrValue !== 'string') {
    return null;
  }
  const matches = hdrValue.match(/(\S+)\s+(\S+)/);
  return matches && { scheme: matches[1], value: matches[2] };
};

export const extractTokenFromRequest = (request) => {
  let token = null;
  if (request.headers[AUTH_HEADER]) {
    const authParams = parseAuthHeader(request.headers[AUTH_HEADER]);
    if (authParams && BEARER_AUTH_SCHEME === authParams.scheme.toLowerCase()) {
      token = authParams.value;
    }
  }
  return token;
};

export const generateToken = ({ _id, isAdmin }) => jwt.sign(
  { userId: _id, isAdmin },
  process.env.TOKEN_HASH,
  { expiresIn: '10d' }
);

export const generatePasswordHash = (pwd) => crypto
  .createHmac('sha256', process.env.PASSWORD_HASH)
  .update(`${pwd}`.trim()).digest('hex');
