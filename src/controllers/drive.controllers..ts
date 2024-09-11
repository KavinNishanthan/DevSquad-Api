// Importing packges
import Joi, { string } from 'joi';
import bcrypt from 'bcryptjs';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { generateUUID } from '../helpers/uuid.helper';

// Importing models
import driveModel from '../models/drive.model';

// Importing constants
import commonConstant from '../constants/common.constant';
import errorLogConstant from '../constants/error-log.constant';
import httpStatusConstant from '../constants/http-message.constant';
import responseMessageConstant from '../constants/response-message.constant';

const createDrive = async (req: Request, res: Response) => {
  try {
    const {
      collegeId,
      companyName,
      driveDate,
      requirements,
      rolesAndSalary,
      numberOfRounds,
      companyLocation,
      roundDetails,
      eligibleBatch,
      eligibleDepartments,
      eligibilityCriteria
    } = req.body;

    const driveValidationSchema = Joi.object({
      collegeId: Joi.string().required(),
      companyName: Joi.string().required(),
      driveDate: Joi.date().required(),
      requirements: Joi.array().items(Joi.string()).required(),
      rolesAndSalary: Joi.array()
        .items(
          Joi.object({
            role: Joi.string().required(),
            salary: Joi.number().required()
          })
        )
        .required(),
      numberOfRounds: Joi.number().required(),
      companyLocation: Joi.string().required(),
      roundDetails: Joi.array()
        .items(
          Joi.object({
            roundNumber: Joi.number().required(),
            description: Joi.string().required(),
            venue: Joi.string().required()
          })
        )
        .required(),
      eligibleBatch: Joi.array().items(Joi.number()).required(),
      eligibleDepartments: Joi.array().items(Joi.string()).required(),
      eligibilityCriteria: Joi.object({
        minTenthMarks: Joi.number().required(),
        minTwelfthMarks: Joi.number().required(),
        minCGPA: Joi.number().required(),
        noHistoryOfArrears: Joi.boolean().required(),
        maxArrears: Joi.number().required()
      }).required()
    });

    const { error } = driveValidationSchema.validate(req.body);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const generatedCompanyId = generateUUID();

    const newDrive = new driveModel({
      collegeId,
      companyId: generatedCompanyId,
      companyName,
      driveDate,
      requirements,
      rolesAndSalary,
      numberOfRounds,
      companyLocation,
      roundDetails,
      eligibleBatch,
      eligibleDepartments,
      eligibilityCriteria
    });

    await newDrive.save();

    res.status(HttpStatusCode.Created).json({
      status: httpStatusConstant.CREATED,
      code: HttpStatusCode.Created,
      message: 'Drive created successfully!'
    });
  } catch (err: any) {
    console.log(errorLogConstant.driveController.createDriveErrorLog, err.message);
    return res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError,
      message: 'Error creating drive'
    });
  }
};

const deleteDrive = async (req: Request, res: Response) => {
  try {
    const { driveId } = req.params;

    if (!driveId) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: 'Drive ID is required'
      });
    }

    const drive = await driveModel.findByIdAndDelete(driveId);

    if (!drive) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: 'Drive not found'
      });
    }

    res.status(HttpStatusCode.Ok).json({
      status: httpStatusConstant.OK,
      code: HttpStatusCode.Ok,
      message: 'Drive deleted successfully'
    });
  } catch (err: any) {
    console.log(errorLogConstant.driveController.deleteDriveErrorLog, err.message);
    return res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError,
      message: 'Error deleting drive'
    });
  }
};

export default {
  createDrive,
  deleteDrive
};
