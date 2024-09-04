// Importing packages
import jwt, { JwtPayload } from 'jsonwebtoken';

// Importing helpers
import { generateUUID } from './uuid.helper';

// Importing models
import jwtTokenModel from '../models/jwt-token.model';

/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to sign jwt token
 */
const signToken = async (payload: any): Promise<any> => {
  try {
    const generatedToken = jwt.sign(payload, process.env.JWT_KEY || '');
    const token = await jwtTokenModel.create({ jwtTokenId: generateUUID(), token: generatedToken });
    return token.jwtTokenId;
  } catch (err: any) {
    return err.message;
  }
};

/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to verify jwt token
 */

const verifyToken = async (jwtTokenId: string): Promise<string | JwtPayload | null> => {
  try {
    let token: any = null;
    const tokenResponse = await jwtTokenModel.findOne({ jwtTokenId });
    if (tokenResponse) {
      token = tokenResponse.token;
    } else {
      token = null;
    }
    return jwt.verify(token, process.env.JWT_KEY || '');
  } catch (err) {
    return null;
  }
};

export { signToken, verifyToken };
