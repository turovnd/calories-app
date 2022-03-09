import validator from 'validator';

import { UserModel } from '../models';
import {
  ValidationError, NotFoundError, generatePasswordHash, generateToken
} from '../utils';


/**
 * Authenticate by user email and password
 *
 * @param email
 * @param password
 * @returns {Promise<*>}
 */
export const login = async ({ email, password }) => {
  if (!email || (email && !validator.isEmail(email))) throw new ValidationError('Invalid email format');
  if (!password) throw new ValidationError('Password is empty');

  const user = await UserModel.findOne({
    email: email.toLowerCase(),
    password: generatePasswordHash(password)
  }, { password: false });

  if (!user) throw new NotFoundError('User does not exist');

  return generateToken(user);
};

/**
 * Create new user account
 *
 * @param name
 * @param email
 * @param password
 * @returns {Promise<*>}
 */
export const signup = async ({ name, email, password }) => {
  if (!email || (email && !validator.isEmail(email))) throw new ValidationError('Invalid email format');
  if (!password) throw new ValidationError('Password is empty');
  if (!name) throw new ValidationError('Invalid user name');

  const user = await UserModel.exists({ email: email.toLowerCase() });
  if (user) throw new NotFoundError(`User with email [${email.toLowerCase()}] already exists`);

  const newUser = await UserModel.create({
    name,
    email: email.toLowerCase(),
    password: generatePasswordHash(password)
  });

  return generateToken(newUser);
};
