import { Types } from 'mongoose';

import UserModel from './User';
import ProductModel from './Product';
import JournalModel from './Journal';

const { ObjectId } = Types;

export {
  ObjectId,
  UserModel,
  ProductModel,
  JournalModel,
};
