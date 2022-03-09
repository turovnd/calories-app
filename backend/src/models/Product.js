import { Schema, model, ObjectId } from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';

export const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: ({
      _id, name, createdBy, createdAt, updatedAt
    }) => ({
      _id, name, createdBy, createdAt, updatedAt
    })
  },
});

schema.plugin(findOrCreate);

schema.static.productData = {
  name: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true
};

export default model('Product', schema);
