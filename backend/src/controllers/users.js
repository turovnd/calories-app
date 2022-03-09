import validator from 'validator';
import { isValidObjectId } from 'mongoose';

import { JournalModel, UserModel } from '../models';
import {
  ValidationError, NotFoundError, AccessError, generatePasswordHash
} from '../utils';


/**
 * Get user by ID
 *
 * @param userId
 * @returns {Promise<*>}
 */
export const getById = async (userId) => {
  if (!isValidObjectId(userId)) throw new ValidationError('Invalid user ID');
  const user = await UserModel
    .findById(userId, UserModel.schema.static.userFull)
    .populate('friends', UserModel.schema.static.userShort);
  if (!user) throw new NotFoundError('User does not exist');
  return user.toJSON();
};

/**
 * Update user by ID
 *
 * @param curUser {{ isAdmin, id }} - current user
 * @param userId - modified user ID
 * @param name
 * @param email
 * @param caloriesLimit
 * @param isAdmin
 * @returns {Promise<*>}
 */
export const update = async (curUser, userId, {
  name, email, caloriesLimit, isAdmin
}) => {
  if (!isValidObjectId(userId)) throw new ValidationError('Invalid user ID');
  if (email && !validator.isEmail(email)) throw new ValidationError('Invalid email format');
  if (typeof isAdmin !== 'undefined' && !curUser.isAdmin) throw new AccessError();

  const user = await UserModel.findById(userId, UserModel.schema.static.userFull);
  if (!user) throw new NotFoundError('User does not exist');

  if (typeof name !== 'undefined') user.name = name;
  if (typeof email !== 'undefined') user.email = email;
  if (typeof caloriesLimit !== 'undefined') user.caloriesLimit = caloriesLimit;
  if (typeof isAdmin !== 'undefined') user.isAdmin = isAdmin;

  await user.save();
  return getById(user._id);
};

/**
 * Invite new friend. Create user if does not exist.
 *
 * @param id - current user ID
 * @param name - friend name
 * @param email - friend email
 * @returns {Promise<*>}
 */
export const inviteFriend = async ({ id }, { name, email }) => {
  if (!email || (email && !validator.isEmail(email))) throw new ValidationError('Invalid email format');
  if (!name) throw new ValidationError('Invalid user name');

  const user = await UserModel.findById(id, UserModel.schema.static.userFull)
    .populate({ path: 'friends', select: UserModel.schema.static.userShort });
  if (!user) throw new NotFoundError('User does not exist');

  const isFriendExists = user.friends.find((fr) => `${fr.email}` === `${email}`);
  if (isFriendExists) throw new ValidationError(`User already has a friend with email [${email}]`);

  let friend = await UserModel.findOne({ email }, { password: false });
  if (!friend) {
    const password = Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(0, 10);
    friend = await UserModel.create({ name, email, password: generatePasswordHash(password) });
    console.log(`[REMOVE IT] Invite new user. Email: [${email}] pwd: [${password}]`);
  }

  user.friends.push(friend._id);
  await user.save();

  return Object.keys(UserModel.schema.static.userShort).reduce((map, k) => ({
    ...map,
    [k]: friend[k]
  }), {});
};

/**
 * Remove friend from the user.
 *
 * @param id - current user ID
 * @param userId - friend user ID
 * @returns {Promise<*>}
 */
export const removeFriend = async ({ id }, userId) => {
  if (!isValidObjectId(userId)) throw new ValidationError('Invalid user ID');

  const user = await UserModel.findById(id, UserModel.schema.static.userFull);
  if (!user) throw new NotFoundError('User does not exist');

  const friendInd = user.friends.findIndex((fId) => `${fId}` === `${userId}`);
  if (friendInd === -1) throw new ValidationError('User is not in list of your friends');
  user.friends.splice(friendInd, 1);
  await user.save();

  return 'OK';
};

/**
 * Search users
 *
 * @param name
 * @param limit
 * @param offset
 * @returns {Promise<*>}
 */
export const search = async ({ name, limit, offset }) => {
  limit = parseInt(limit || 30, 10);
  offset = parseInt(offset || 0, 10);
  const query = {};

  if (name) {
    query.$or = [
      { name: { $regex: name, $options: 'i' } },
      { email: { $regex: name, $options: 'i' } }
    ];
  }

  return {
    total: await UserModel.countDocuments(query),
    limit,
    offset,
    rows: await UserModel.find(query, UserModel.schema.static.userShort)
      .lean()
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 })
  };
};

/**
 * Delete user and all his data.
 *
 * @param userId
 * @returns {Promise<*>}
 */
export const remove = async (userId) => {
  if (!isValidObjectId(userId)) throw new ValidationError('Invalid user ID');
  const user = await UserModel.findOneAndRemove({ _id: userId });
  if (!user) throw new NotFoundError('User does not exist');

  await JournalModel.deleteMany({ userId });
  await UserModel.updateMany({}, { $pull: { friends: userId } });

  return 'OK';
};
