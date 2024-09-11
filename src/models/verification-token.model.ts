// Importing packages
import { Schema, model } from 'mongoose';

// Importing interfaces
import { IVerificationToken } from '../interfaces/model.interfaces';

const schema = new Schema<IVerificationToken>(
  {
    verificationTokenId: {
      type: String,
      unique: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default model<IVerificationToken>('verification_token', schema);
