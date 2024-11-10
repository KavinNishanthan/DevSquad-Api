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
import studentModel from '../models/student.model';

const createDrive = async (req: Request, res: Response) => {
  try {
    const {
      companyName,
      driveDate,
      jobType,
      rolesAndSalary,
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
      jobType:Joi.string().required(),
      rolesAndSalary: Joi.array()
        .items(
          Joi.object({
            role: Joi.string().required(),
            salary: Joi.number().required()
          })
        )
        .required(),
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
        noHistoryOfArrears: Joi.number().required(),
        maxArrears: Joi.number().required()
      }).required(),
      techStackEligibility: Joi.object({
        isTechStackRequired: Joi.boolean().required(),
        requiredSkills: Joi.array().items(Joi.string()).when('isTechStackRequired', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        })
      }),
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
      jobType,
      rolesAndSalary,
      companyLocation,
      roundDetails,
      eligibleBatch,
      eligibleDepartments,
      eligibilityCriteria,
      techStackEligibility,
    });

    await newDrive.save();

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

const handleOptInDrive = async (req: Request, res: Response) => {
  try {
    const { studentId, companyId } = req.params;

    const optInValidationSchema = Joi.object({
      studentId: Joi.string().required(),
      companyId: Joi.string().required()
    });

    const { error } = optInValidationSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message.replace(/"/g, '') });
    }

    const drive = await driveModel.findOne({ companyId });
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    if (drive.isOpen) {
      return res.status(400).json({ message: 'Drive is not open for opting in' });
    }

    if (drive.optedStudents.includes(studentId)) {
      return res.status(400).json({ message: 'Student already opted in for the drive' });
    }

    drive.optedStudents.push(studentId);
    await drive.save();

    return res.status(200).json({ message: 'Student successfully opted in for the drive' });
  } catch (err: any) {
    console.log(errorLogConstant.driveController.handleOptInDrivesErrorLog, err.message);
    return res.status(500).json({
      status: httpStatusConstant.ERROR,
      code: 500,
      message: 'Internal server error'
    });
  }
};

const handleOptOutDrive = async (req: Request, res: Response) => {
  try {
    const { studentId, companyId } = req.params;

    const optOutValidationSchema = Joi.object({
      studentId: Joi.string().required(),
      companyId: Joi.string().required()
    });

    const { error } = optOutValidationSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message.replace(/"/g, '') });
    }

    const drive = await driveModel.findOne({ companyId });
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    if (drive.isOpen) {
      return res.status(400).json({ message: 'Drive is not open for opting out' });
    }

    if (drive.optedOutStudents.includes(studentId)) {
      return res.status(400).json({ message: 'Student already opted out of the drive' });
    }

    drive.optedOutStudents.push(studentId);
    await drive.save();

    return res.status(200).json({ message: 'Student successfully opted out of the drive' });
  } catch (err: any) {
    console.log(errorLogConstant.driveController.handleOptOutDrivesErrorLog, err.message);
    return res.status(500).json({
      status: httpStatusConstant.ERROR,
      code: 500,
      message: 'Internal server error'
    });
  }
};

const fetchOptedStudents = async (req: Request, res: Response) => {
  try {
    const fetchOptedStudentsSchema = Joi.object({
      companyId: Joi.string().required()
    });

    const { error } = fetchOptedStudentsSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { companyId } = req.params;

    const drive = await driveModel.findOne({ companyId });
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    const optedStudentsIds = drive.optedStudents;

    if (optedStudentsIds.length === 0) {
      return res.status(200).json({ message: 'No students have opted in for this drive' });
    }

    const studentsDetails = await studentModel.find(
      { studentId: { $in: optedStudentsIds } },
      {
        name: 1,
        email: 1,
        register_number: 1,
        department: 1,
        contact_number: 1
      }
    );

    if (studentsDetails.length === 0) {
      return res.status(404).json({ message: 'No students found for the opted IDs' });
    }

    return res.status(200).json(studentsDetails);
  } catch (err: any) {
    console.log(errorLogConstant.driveController.fetchOptedStudentsDetailsErrorLog, err.message);
    return res.status(500).json({
      status: httpStatusConstant.ERROR,
      code: 500,
      message: 'Internal server error'
    });
  }
};

const fetchOptedOutStudents = async (req: Request, res: Response) => {
  try {
    const fetchOptedOutStudentsSchema = Joi.object({
      companyId: Joi.string().required()
    });

    const { error } = fetchOptedOutStudentsSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { companyId } = req.params;

    const drive = await driveModel.findOne({ companyId });
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    const optedOutStudentsIds = drive.optedOutStudents;

    if (optedOutStudentsIds.length === 0) {
      return res.status(200).json({ message: 'No students have opted out for this drive' });
    }

    const studentsDetails = await studentModel.find(
      { studentId: { $in: optedOutStudentsIds } },
      {
        name: 1,
        email: 1,
        register_number: 1,
        department: 1,
        contact_number: 1
      }
    );

    if (studentsDetails.length === 0) {
      return res.status(404).json({ message: 'No students found for the opted-out IDs' });
    }

    return res.status(200).json(studentsDetails);
  } catch (err: any) {
    console.log(errorLogConstant.driveController.fetchOptedOutStudentsDetailsErrorLog, err.message);
    return res.status(500).json({
      status: httpStatusConstant.ERROR,
      code: 500,
      message: 'Internal server error'
    });
  }
};

const updatePlacedStudents = async (req: Request, res: Response) => {
  try {
    const { companyId, studentId } = req.params;

    const schema = Joi.object({
      studentId: Joi.string().required(),
      companyId: Joi.string().required()
    });

    const { error } = schema.validate(req.params);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const drive = await driveModel.findOne({ companyId });
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    if (drive.placedStudents.includes(studentId)) {
      return res.status(400).json({ message: 'Student already marked as placed for this drive' });
    }

    drive.placedStudents.push(studentId);
    await drive.save();

    return res.status(200).json({
      message: 'Student successfully added to placed students list',
      placedStudents: drive.placedStudents
    });
  } catch (err: any) {
    console.error('Error updating placed students:', err.message);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export default {
  createDrive,
  deleteDrive,
  getDrives,
  handleOptInDrive,
  handleOptOutDrive,
  fetchOptedStudents,
  fetchOptedOutStudents,
  updatePlacedStudents
};
