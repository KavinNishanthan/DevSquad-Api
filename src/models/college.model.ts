// Importing packages
import { Schema, model } from 'mongoose';

// Importing interfaces
import { ICollege } from '../interfaces/model.interfaces';

const batchSchema = new Schema({
  batchId: {
    type: String,
    required: true
  },
  totalNoOfStudents: {
    type: Number,
    required: true
  },
  students: {
    type: [String],
    default: []
  },
  subscription: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      required: true
    }
  }
});

const collegeSchema = new Schema<ICollege>({
  collegeId: {
    type: String,
    required: true,
    unique: true
  },
  collegeName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  contact: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  batches: {
    type: [batchSchema],
    required: false,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const College = model<ICollege>('College', collegeSchema);

export default College;
