// Importing packges
import Joi, { string } from 'joi';
import bcrypt from 'bcryptjs';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { generateUUID } from '../helpers/uuid.helper';
import { filterEligibleStudents } from '../helpers/filterStudents.helper';

// Importing models
import driveModel from '../models/drive.model';
import resumeModel from '../models/resume.model';

// Importing constants
import commonConstant from '../constants/common.constant';
import errorLogConstant from '../constants/error-log.constant';
import httpStatusConstant from '../constants/http-message.constant';
import responseMessageConstant from '../constants/response-message.constant';

const createDrive = async (req: Request, res: Response) => {
  try {
    const {
      companyName,
      driveDate,
      requirements,
      rolesAndSalary,
      numberOfRounds,
      companyLocation,
      roundDetails,
      eligibleBatch,
      eligibleDepartments,
      eligibilityCriteria,
      techStackEligibility
    } = req.body;

    const { collegeId } = req.params;

    if (!collegeId) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: 'College ID is required'
      });
    }

    const driveValidationSchema = Joi.object({
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
      }).required(),
      techStackEligibility: Joi.object({
        isTechStackRequired: Joi.boolean().required(),
        requiredSkills: Joi.array().items(Joi.string()).default([])
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
      eligibilityCriteria,
      techStackEligibility
    });

    await newDrive.save();

    // After creating the drive, immediately run the filterEligibleStudents function
    await filterEligibleStudents(generatedCompanyId);

    res.status(HttpStatusCode.Created).json({
      status: httpStatusConstant.CREATED,
      code: HttpStatusCode.Created,
      message: 'Drive created and eligible students filtered successfully!'
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
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: 'Drive ID is required'
      });
    }

    const drive = await driveModel.findOneAndDelete({ companyId });

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

const getDrives = async (req: Request, res: Response) => {
  try {
    const { collegeId } = req.params;

    const validateRequest = Joi.object({
      collegeId: Joi.string().required()
    });

    const { error } = validateRequest.validate(req.params);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const drives = await driveModel.find({ collegeId });

    if (drives.length === 0) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: 'No drives found for the provided college ID'
      });
    }

    res.status(HttpStatusCode.Ok).json({
      status: httpStatusConstant.SUCCESS,
      code: HttpStatusCode.Ok,
      message: 'Drives fetched successfully!',
      data: drives
    });
  } catch (err: any) {
    console.log(errorLogConstant.driveController.getDrivesErrorLog, err.message);
    return res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError,
      message: 'Internal server error'
    });
  }
};


export default {
  createDrive,
  deleteDrive,
  getDrives
};
