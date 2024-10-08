// Importing packages
import { Schema, model } from 'mongoose';

// Importing interfaces

import { IStudent } from '../interfaces/model.interfaces';

const schema = new Schema<IStudent>({
  studentId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  personal_email: {
    type: String,
    default: null
  },
  register_number: {
    type: String,
    required: true,
    unique: true
  },
  contact_number: {
    type: String,
    default: null
  },
  department: {
    type: String,
    default: null
  },
  collegeId: {
    type: String,
    required: true
  },
  batchId: {
    type: String,
    required: true
  },
  profilePictureUrl: {
    type: String,
    default: null
  },
  profilePictureKey: {
    type: String,
    default: null
  },
  isUpdated: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

export default model<IStudent>('Student', schema);
