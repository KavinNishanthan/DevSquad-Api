// Importing packages
import { HttpStatusCode } from 'axios';
import { Response, NextFunction } from 'express';

// Importing models
import studentModal from '../models/student.model';

// Importing constants
import httpStatusConstant from '../constants/http-message.constant';
import responseMessageConstant from '../constants/response-message.constant';

// Importing helpers
import { verifyToken } from '../helpers/jwt.helper';
import { getSkillTrackSignature } from '../helpers/cookie.helper';

/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-08-28
 * @description This function is used to handle verify user
 */
export const verifyUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.cookie) {
      return res.status(HttpStatusCode.Unauthorized).json({
        status: httpStatusConstant.UNAUTHORIZED,
        code: HttpStatusCode.Unauthorized
      });
    }
    const accessToken: any = getSkillTrackSignature(req.headers.cookie);

    if (!accessToken) {
      return res.status(HttpStatusCode.Unauthorized).json({
        status: httpStatusConstant.UNAUTHORIZED,
        code: HttpStatusCode.Unauthorized
      });
    } else {
      const decodedToken: any = await verifyToken(accessToken);

      if (!decodedToken) {
        return res.status(HttpStatusCode.Unauthorized).json({
          status: httpStatusConstant.UNAUTHORIZED,
          code: HttpStatusCode.Unauthorized
        });
      }

      const userResponse = await studentModal
        .findOne({
          studentId: decodedToken.studentId,
          isActive: true
        })
        .select('-password -_id -isManualAuth -createdAt -updatedAt -googleId -__v');
      req.userSession = decodedToken;
      next();
    }
  } catch (err) {
    res.status(HttpStatusCode.Unauthorized).json({
      status: httpStatusConstant.UNAUTHORIZED,
      code: HttpStatusCode.Unauthorized,
      message: responseMessageConstant.INVALID_TOKEN
    });
  }
};

export default verifyUser;
