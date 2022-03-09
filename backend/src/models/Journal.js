import { Schema, model, ObjectId } from 'mongoose';

export const schema = new Schema({
  productId: {
    type: ObjectId,
    ref: 'Product',
    required: true
  },
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  calories: {
    type: Number,
    required: true,
    validate: val => val > 0
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: ({
      _id, userId, productId, calories, createdAt, updatedAt
    }) => ({
      _id,
      ...(userId && userId._id ? { user: userId } : { userId }),
      ...(productId && productId._id ? { product: productId } : { productId }),
      calories,
      createdAt,
      updatedAt
    })
  }
});


schema.static.journalData = {
  productId: true,
  userId: true,
  calories: true,
  createdAt: true,
  updatedAt: true
};

export default model('Journal', schema);
