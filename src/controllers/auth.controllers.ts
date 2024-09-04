// Importing packges
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { generateUUID } from '../helpers/uuid.helper';

// Importing models
import studentModel from '../models/student.model';
import collegeModel from '../models/college.model';
import jwtTokenModel from '../models/jwt-token.model';

// Importing constants
import commonConstant from '../constants/common.constant';
import errorLogConstant from '../constants/error-log.constant';
import httpStatusConstant from '../constants/http-message.constant';
import responseMessageConstant from '../constants/response-message.constant';

// Importing Helpers
import { signToken, verifyToken } from '../helpers/jwt.helper';
import { getSkillTrackSignature } from '../helpers/cookie.helper';

// Import the multer middleware
import * as XLSX from 'xlsx';
import * as fs from 'fs';

/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to handle College register
 */

const handleCollegeRegister = async (req: Request, res: Response) => {
  try {
    const { collegeName, email, password, contact, location } = req.body;

    const userValidation = Joi.object({
      collegeName: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      contact: Joi.number().required(),
      location: Joi.string().required()
    });

    const { error } = userValidation.validate(req.body);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const checkIsUserExists = await collegeModel
      .findOne({
        email
      })
      .select('email -_id');

    if (checkIsUserExists) {
      res.status(HttpStatusCode.Conflict).json({
        status: httpStatusConstant.CONFLICT,
        code: HttpStatusCode.Conflict,
        message: responseMessageConstant.USER_ALREADY_EXISTS
      });
    } else {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const generatedUserId = generateUUID();
      await collegeModel.create({
        collegeId: generatedUserId,
        collegeName,
        email,
        isActive: true,
        location,
        contact,
        profilePicture: `https://avatars.dicebear.com/api/initials/${collegeName.replaceAll(' ', '-')}.png`,
        password: encryptedPassword
      });

      const generatedAccessToken = await signToken({
        collegeId: generatedUserId,
        email
      });
      res
        .cookie(commonConstant.signatureCookieName, generatedAccessToken, {
          maxAge: 3600000,
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        })
        .status(HttpStatusCode.Created)
        .json({
          status: httpStatusConstant.CREATED,
          code: HttpStatusCode.Created
        });
    }
  } catch (err: any) {
    console.log(errorLogConstant.authController.handleRegisterErrorLog, err.message);
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ status: httpStatusConstant.ERROR, code: HttpStatusCode.InternalServerError });
  }
};

/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to handle user login
 */

const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userValidation = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required()
    });

    const { error } = userValidation.validate(req.body);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }
    const userResponse = await studentModel.findOne({
      email
    });

    if (!userResponse) {
      const userResponse = await collegeModel.findOne({
        email
      });

      if (!userResponse) {
        return res.status(HttpStatusCode.NotFound).json({
          status: httpStatusConstant.NOT_FOUND,
          code: HttpStatusCode.NotFound,
          message: responseMessageConstant.USER_NOT_FOUND
        });
      } else {
        const isValidPassword = await bcrypt.compare(password, userResponse.password || '');

        if (isValidPassword) {
          const { email, collegeName, collegeId } = userResponse;
          const generatedAccessToken = await signToken({
            collegeId,
            collegeName,
            email
          });
          res
            .cookie(commonConstant.signatureCookieName, generatedAccessToken, {
              maxAge: 3600000,
              httpOnly: false,
              secure: true,
              sameSite: 'none'
            })
            .status(HttpStatusCode.Ok)
            .json({
              status: httpStatusConstant.OK,
              code: HttpStatusCode.Ok
            });
        } else {
          res.status(HttpStatusCode.Unauthorized).json({
            status: httpStatusConstant.UNAUTHORIZED,
            code: HttpStatusCode.Unauthorized,
            message: responseMessageConstant.INVALID_CREDENTIALS
          });
        }
      }
    } else {
      const isValidPassword = await bcrypt.compare(password, userResponse.password || '');

      if (isValidPassword) {
        const { email, name, studentId } = userResponse;
        const generatedAccessToken = await signToken({
          studentId,
          name,
          email
        });
        res
          .cookie(commonConstant.signatureCookieName, generatedAccessToken, {
            maxAge: 3600000,
            httpOnly: false,
            secure: true,
            sameSite: 'none'
          })
          .status(HttpStatusCode.Ok)
          .json({
            status: httpStatusConstant.OK,
            code: HttpStatusCode.Ok
          });
      } else {
        res.status(HttpStatusCode.Unauthorized).json({
          status: httpStatusConstant.UNAUTHORIZED,
          code: HttpStatusCode.Unauthorized,
          message: responseMessageConstant.INVALID_CREDENTIALS
        });
      }
    }
  } catch (err: any) {
    console.log(errorLogConstant.authController.handleLoginErrorLog, err.message);
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ status: httpStatusConstant.ERROR, code: HttpStatusCode.InternalServerError });
  }
};



/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to handle user login
 */

const handleLogout = async (req: Request | any, res: Response) => {
  try {
    const jwtTokenId: any = getSkillTrackSignature(req.headers.cookie);

    await jwtTokenModel.findOneAndDelete({
      jwtTokenId
    });

    res
      .clearCookie(commonConstant.signatureCookieName, {
        secure: true,
        sameSite: 'none'
      })
      .status(HttpStatusCode.Ok)
      .json({
        status: httpStatusConstant.OK,
        code: HttpStatusCode.Ok
      });
  } catch (err: any) {
    console.log(errorLogConstant.authController.handleLogoutErrorLog, err.message);
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ status: httpStatusConstant.ERROR, code: HttpStatusCode.InternalServerError });
  }
};

/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to handle verifiy session
 */

const handleVerifiySession = async (req: Request, res: Response) => {
  try {
    if (!req.headers.cookie) {
      return res.status(HttpStatusCode.Unauthorized).json({
        status: httpStatusConstant.UNAUTHORIZED,
        code: HttpStatusCode.Unauthorized
      });
    }
    const skillTrackSignature: any = req.headers.cookie
      .split(';')
      .find((cookie: any) => cookie.trim().startsWith(commonConstant.signatureCookieName));

    if (!skillTrackSignature) {
      return res.status(HttpStatusCode.Unauthorized).json({
        status: httpStatusConstant.UNAUTHORIZED,
        code: HttpStatusCode.Unauthorized
      });
    } else {
      const accessToken = skillTrackSignature.split('=')[1];
      const decodedToken: any = await verifyToken(accessToken);

      if (!decodedToken) {
        return res.status(HttpStatusCode.Unauthorized).json({
          status: httpStatusConstant.UNAUTHORIZED,
          code: HttpStatusCode.Unauthorized
        });
      }

      const userResponse = await studentModel
        .findOne({
          studentId: decodedToken.studentId
        })
        .select('-password -_id -isManualAuth -createdAt -updatedAt -googleId -__v');

      res.status(HttpStatusCode.Ok).json({
        status: httpStatusConstant.OK,
        code: HttpStatusCode.Ok,
        data: userResponse
      });
    }
  } catch (err: any) {
    console.log(errorLogConstant.authController.handleVerifySessionErrorLog, err.message);
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ status: httpStatusConstant.ERROR, code: HttpStatusCode.InternalServerError });
  }
};

/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to handle Student Register
 */

const handleStudentRegister = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        status: 'BadRequest',
        code: 400,
        message: 'No file uploaded.'
      });
    }

    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const records = XLSX.utils.sheet_to_json<{ email: string; register_number: string }>(sheet);

    for (const row of records) {
      const { email, register_number } = row;

      if (!email || !register_number) {
        console.log('Missing email or register number in row:', row);
        continue;
      }

      const name = email.split('@')[0];
      const password = 'defaultPassword';

      const checkIsUserExists = await studentModel.findOne({ email }).select('email -_id');

      if (checkIsUserExists) {
        console.log(`User already exists: ${email}`);
        continue;
      } else {
        const encryptedPassword = await bcrypt.hash(password, 10);
        const generatedUserId = generateUUID();

        await studentModel.create({
          studentId: generatedUserId,
          name,
          email,
          register_number,
          password: encryptedPassword,
          isManualAuth: true,
          collegeId: 'your_college_id',
          batchId: 'your_batch_id'
        });
      }
    }

    fs.unlink(file.path, (err) => {
      if (err) {
        console.error('Failed to delete the file:', err);
      } else {
        console.log('Uploaded file deleted successfully.');
      }
    });

    res.status(201).json({
      status: 'Created',
      code: 201,
      message: 'Bulk registration completed.'
    });
  } catch (err: any) {
    console.error('Error during bulk registration:', err.message);
    res.status(500).json({
      status: 'InternalServerError',
      code: 500,
      message: 'An error occurred during bulk registration.'
    });
  }
};

export default {
  handleCollegeRegister,
  handleLogin,
  handleVerifiySession,
  handleLogout,
  handleStudentRegister
};
