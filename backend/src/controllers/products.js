import { isValidObjectId } from 'mongoose';

import { JournalModel, ProductModel, UserModel } from '../models';
import { ValidationError, NotFoundError } from '../utils';

/**
 * Search products
 *
 * @param id - current user ID
 * @param name - product name
 * @param onlyMy
 * @param limit
 * @param offset
 * @returns {Promise<*>}
 */
export const search = async ({ id }, {
  name, onlyMy, limit, offset
}) => {
  const query = {
    ...(name ? { name: { $regex: name, $options: 'i' } } : {}),
    ...(onlyMy === 'true' ? { createdBy: id } : {})
  };

  limit = parseInt(limit || 30, 10);
  offset = parseInt(offset || 0, 10);

  return {
    total: await ProductModel.countDocuments(query),
    limit,
    offset,
    rows: await ProductModel.find(query)
      .populate('createdBy', UserModel.schema.static.userShort)
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 })
  };
};

/**
 * Create new product
 *
 * @param id
 * @param name
 * @returns {Promise<*>}
 */
export const create = async ({ id }, { name }) => {
  if (!name) throw new ValidationError('Product name is invalid');
  const product = await ProductModel.findOrCreate({
    name,
    createdBy: id
  }).then((resp) => resp.doc);
  const creator = await UserModel.findById(id, UserModel.schema.static.userShort);
  return {
    ...product.toJSON(),
    createdBy: creator,
  };
};

/**
 * Update product by ID
 *
 * @param productId
 * @param name
 * @returns {Promise<*>}
 */
export const update = async (productId, { name }) => {
  if (!isValidObjectId(productId)) throw new ValidationError('Invalid product ID');
  if (!name) throw new ValidationError('Product name is invalid');
  const product = await ProductModel.findById(productId)
    .populate('createdBy', UserModel.schema.static.userShort);
  if (!product) throw new NotFoundError('Product does not exist');
  product.name = name;
  await product.save();
  return product.toJSON();
};

/**
 * Remove product by ID
 *
 * @param productId
 * @returns {Promise<*>}
 */
export const remove = async (productId) => {
  if (!isValidObjectId(productId)) throw new ValidationError('Invalid product ID');
  const product = await ProductModel.findOneAndRemove({ _id: productId });
  if (!product) throw new NotFoundError('Product does not exist');
  await JournalModel.deleteMany({ productId });
  return 'OK';
};
