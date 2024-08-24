import mongoose, { Schema, Document, CallbackError } from 'mongoose';

interface IPerson extends Document {
  name: string;
  gender: 'Male' | 'Female';
  id: number;
  partnerId?: mongoose.Types.ObjectId | string | null;
  fatherId?: mongoose.Types.ObjectId | string | null;
  motherId?: mongoose.Types.ObjectId | string | null;
}

const counterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, required: true },
});

const Counter = mongoose.model('Counter', counterSchema);


const personSchema = new Schema<IPerson>({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  id: {
    type: Number,
    unique: true,
  },
  partnerId: {
    type: Number,
    default: null,
  },
  fatherId: {
    type: Number,
    default: null,
  },
  motherId: {
    type: Number,
    default: null,
  }
});

personSchema.pre('save', async function (next) {
  const doc = this as IPerson;

  if (doc.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'personId' },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      if (!counter) {
        console.error('Counter not found or not updated');
        throw new Error('Counter not found or not updated');
      }
      doc.id = counter.value;
      console.log('Generated ID:', doc.id);
    } catch (error) {
      console.error('Error in pre-save middleware:', error);
      return next(error as CallbackError);
    }
  }

  next();
});

personSchema.methods.toJSON = function() {
  const obj = this.toObject();

  if (obj.partnerId && obj.partnerId instanceof mongoose.Types.ObjectId) {
    obj.partnerId = obj.partnerId.toHexString();
  }
  if (obj.fatherId && obj.fatherId instanceof mongoose.Types.ObjectId) {
    obj.fatherId = obj.fatherId.toHexString();
  }
  if (obj.motherId && obj.motherId instanceof mongoose.Types.ObjectId) {
    obj.motherId = obj.motherId.toHexString();
  }

  return obj;
};

const Person = mongoose.model<IPerson>('Person', personSchema);
export { Person };
