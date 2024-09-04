// Importing packages
import { Schema, model } from 'mongoose';

// Importing interfaces
import { IJwtToken } from '../interfaces/model.interfaces';

const schema = new Schema<IJwtToken>(
  {
    jwtTokenId: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600000
    }
  },
  {
    timestamps: true
  }
);

export default model<IJwtToken>('jwt_tokens', schema);
