import { isValidObjectId } from 'mongoose';

import {
  JournalModel, UserModel, ProductModel, ObjectId
} from '../models';
import {
  ValidationError, NotFoundError, AccessError, formatDate, formatStartOfDate, formatEndOfDate
} from '../utils';

/**
 * Search food entities
 *
 * @param id - current user ID
 * @param fromDate - start date for searching
 * @param dueDate - end date for searching
 * @param userId - only for `admin`
 * @param limit
 * @param offset
 * @returns {Promise<*>}
 */
export const search = async ({ id }, {
  fromDate, dueDate, userId, limit, offset
}) => {
  if (fromDate && Number.isNaN(+new Date(fromDate))) throw new ValidationError('Invalid from date');
  if (dueDate && Number.isNaN(+new Date(dueDate))) throw new ValidationError('Invalid due date');
  limit = parseInt(limit || 30, 10);
  offset = parseInt(offset || 0, 10);

  const query = {
    userId: id,
    ...(userId && userId !== 'ALL' ? { userId } : {}),
    ...(fromDate && dueDate ? {
      createdAt: { $gte: formatStartOfDate(fromDate), $lte: formatEndOfDate(dueDate) }
    } : {}),
    ...(fromDate && !dueDate ? { createdAt: { $gte: formatStartOfDate(fromDate) } } : {}),
    ...(!fromDate && dueDate ? { createdAt: { $lte: formatEndOfDate(dueDate) } } : {}),
  };

  if (userId === 'ALL') {
    delete query.userId;
  }

  return {
    total: await JournalModel.countDocuments(query),
    limit,
    offset,
    rows: await JournalModel.find(query, JournalModel.schema.static.journalData)
      .populate('userId', UserModel.schema.static.userShort)
      .populate('productId', ProductModel.schema.static.productData)
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 })
  };
};

/**
 * Get food entity by ID
 *
 * @param isAdmin
 * @param id - current user ID
 * @param entityId
 * @returns {Promise<*>}
 */
export const getById = async ({ isAdmin, id }, entityId) => {
  if (!isValidObjectId(entityId)) throw new ValidationError('Invalid food entity ID');
  const entity = await JournalModel.findById(entityId)
    .populate('userId', UserModel.schema.static.userShort)
    .populate('productId', ProductModel.schema.static.productData);
  if (!entity) throw new NotFoundError('Food entity does not exist');
  if (`${entity.userId._id}` !== `${id}` && !isAdmin) {
    throw new AccessError('You have not access to the food entity data');
  }
  return entity.toJSON();
};

/**
 * Create new food entity data.
 *
 * @param user {{ id, isAdmin }} - current user
 * @param productId
 * @param userId - available only for `admin` role
 * @param calories
 * @param createdAt
 * @returns {Promise<*>}
 */
export const create = async (user, {
  productId, userId, calories, createdAt
}) => {
  if (!isValidObjectId(productId)) throw new ValidationError('Invalid product ID');
  if (Number.isNaN(calories)) throw new ValidationError('Calories should be valid number');
  if (userId && !isValidObjectId(userId)) throw new ValidationError('Invalid user ID');
  if (createdAt && Number.isNaN(+new Date(createdAt))) throw new ValidationError('Invalid created date');
  if ((userId || createdAt) && !user.isAdmin) throw new AccessError();
  const entity = await JournalModel.create({
    productId,
    userId: userId || user.id,
    calories,
    createdAt: formatDate(createdAt || new Date())
  });
  return getById(user, entity._id);
};

/**
 * Update food entity data
 *
 * @param user {{ id, isAdmin }} - current user
 * @param entityId
 * @param calories
 * @param productId
 * @param userId
 * @param createdAt
 * @returns {Promise<void>}
 */
export const update = async (user, entityId, {
  calories, productId, userId, createdAt
}) => {
  if (!isValidObjectId(entityId)) throw new ValidationError('Invalid food entity ID');
  if (Number.isNaN(calories)) throw new ValidationError('Calories should be valid number');
  if (userId && !isValidObjectId(userId)) throw new ValidationError('Invalid user ID');
  if (createdAt && Number.isNaN(+new Date(createdAt))) throw new ValidationError('Invalid created date');

  const entity = await JournalModel.findById(entityId);
  if (!entity) throw new NotFoundError('Food entity does not exist');

  // Only admin can edit `userId` and `createdAt`
  if ((userId || createdAt) && !user.isAdmin) throw new AccessError();

  // Only admin or owner can edit data
  if (`${user.id}` !== `${entity.userId}` && !user.isAdmin) throw new AccessError();

  entity.calories = calories;
  entity.productId = productId || entity.productId;
  entity.userId = userId || entity.userId;
  entity.createdAt = formatDate(createdAt || entity.createdAt);

  await entity.save();
  return getById(user, entity._id);
};

/**
 * Remove food entity data
 *
 * @param user
 * @param entityId
 * @returns {Promise<*>}
 */
export const remove = async (user, entityId) => {
  if (!isValidObjectId(entityId)) throw new ValidationError('Invalid food entity ID');
  const entity = await JournalModel.findById(entityId);
  if (!entity) throw new NotFoundError('Food entity does not exist');
  if (`${user.id}` !== `${entity.userId}` && !user.isAdmin) throw new AccessError();
  await entity.remove();
  return 'OK';
};

/**
 * Get statistics
 *
 * @returns {Promise<*>}
 */
export const getStatistic = async () => {
  const today = new Date();
  const week = 7 * 24 * 60 * 60 * 1000;
  const prevWeekStart = new Date(+today - week);
  const prev2WeekStart = new Date(+today - 2 * week);
  const caloriesQuery = [
    {
      $project: {
        userId: 1,
        calories: 1,
        date: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt'
          }
        },
      }
    },
    {
      $group: {
        _id: '$userId',
        calories: { $sum: '$calories' },
        dates: { $addToSet: '$date' }
      }
    },
    {
      $project: {
        _id: 1,
        caloriesPerDay: { $divide: ['$calories', { $size: '$dates' }] }
      }
    },
    {
      $group: {
        _id: 0,
        result: {
          $avg: '$caloriesPerDay'
        }
      }
    }
  ];

  return JournalModel.aggregate([
    {
      $facet: {
        entriesCurrentWeek: [
          {
            $match: {
              createdAt: {
                $gte: formatStartOfDate(prevWeekStart)
              }
            },
          },
          {
            $count: 'count'
          }
        ],
        entriesWeekBefore: [
          {
            $match: {
              createdAt: {
                $lte: formatEndOfDate(prevWeekStart),
                $gte: formatStartOfDate(prev2WeekStart)
              }
            }
          },
          {
            $count: 'count'
          }
        ],
        avgCaloriesCurrentWeek: [
          {
            $match: {
              createdAt: {
                $gte: formatStartOfDate(prevWeekStart)
              }
            },
          },
          ...caloriesQuery
        ],
        avgCaloriesWeekBefore: [
          {
            $match: {
              createdAt: {
                $lte: formatEndOfDate(prevWeekStart),
                $gte: formatStartOfDate(prev2WeekStart)
              }
            }
          },
          ...caloriesQuery
        ],
      }
    }
  ]).then((docs) => ({
    entriesCurrentWeek: ((docs[0] || {}).entriesCurrentWeek[0] || {}).count,
    entriesWeekBefore: ((docs[0] || {}).entriesWeekBefore[0] || {}).count,
    avgCaloriesCurrentWeek: ((docs[0] || {}).avgCaloriesCurrentWeek[0] || {}).result,
    avgCaloriesWeekBefore: ((docs[0] || {}).avgCaloriesWeekBefore[0] || {}).result,
  }));
};

/**
 * Get my report
 *
 * @returns {Promise<*>}
 */
export const getMyReport = async ({ id }, { fromDate, dueDate }) => {
  if (fromDate && Number.isNaN(+new Date(fromDate))) throw new ValidationError('Invalid from date');
  if (dueDate && Number.isNaN(+new Date(dueDate))) throw new ValidationError('Invalid due date');

  const today = new Date();
  const week = 7 * 24 * 60 * 60 * 1000;
  const prev2Weeks = new Date(+today - 2 * week);
  const userData = await UserModel.exists({ _id: id });
  if (!userData) throw new NotFoundError('User does not exist');

  return JournalModel.aggregate([
    {
      $match: {
        userId: ObjectId(id),
        $or: [
          {
            createdAt: (fromDate && dueDate) ? {
              $gte: formatStartOfDate(fromDate),
              $lte: formatEndOfDate(dueDate),
            } : {
              $gte: formatStartOfDate(prev2Weeks)
            }
          },
          {
            createdAt: {
              $gte: formatStartOfDate(today),
              $lte: formatEndOfDate(today),
            }
          }
        ]
      },
    },
    {
      $project: {
        calories: 1,
        date: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt'
          }
        },
      }
    },
    {
      $group: {
        _id: '$date',
        calories: { $sum: '$calories' },
      }
    },
  ]).then((docs) => docs.map(({ _id, calories }) => ({
    date: _id,
    calories
  })).sort((a, b) => +new Date(a) - +new Date(b)));
};
