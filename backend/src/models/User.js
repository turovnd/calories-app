import { Schema, model, ObjectId } from 'mongoose';
import validator from 'validator';

export const schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (v) => validator.isEmail(v)
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    validate: (v) => validator.isHash(v, 'sha256')
  },
  caloriesLimit: {
    type: Number,
    required: true,
    default: 2100
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  friends: {
    type: [{
      type: ObjectId,
      required: true,
      ref: 'User',
    }],
    default: []
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: ({
      _id, name, email, isAdmin, caloriesLimit, friends, createdAt, updatedAt
    }) => ({
      _id, name, email, isAdmin, caloriesLimit, friends, createdAt, updatedAt
    })
  }
});

schema.static.userShort = {
  _id: true,
  name: true,
  email: true,
  isAdmin: true,
  createdAt: true,
};

schema.static.userFull = {
  _id: true,
  name: true,
  email: true,
  isAdmin: true,
  friends: true,
  caloriesLimit: true,
  createdAt: true,
  updatedAt: true
};

export default model('User', schema);
