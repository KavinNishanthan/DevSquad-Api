// Importing packges
import Joi, { string } from 'joi';
import bcrypt from 'bcryptjs';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { generateUUID } from '../helpers/uuid.helper';

// Importing models
import driveModel from '../models/drive.model';
import studentModel from '../models/student.model';

// Importing constants
import commonConstant from '../constants/common.constant';
import errorLogConstant from '../constants/error-log.constant';
import httpStatusConstant from '../constants/http-message.constant';
import responseMessageConstant from '../constants/response-message.constant';

const updateContactDetails = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { contact_number, personal_email, department } = req.body;

    // Joi validation schema for updating contact details
    const updateContactSchema = Joi.object({
      studentId: Joi.string().required(),
      contact_number: Joi.string().optional(),
      personal_email: Joi.string().email().optional(),
      department: Joi.string().optional(),
      profilePictureUrl: Joi.string().optional(),
      profilePictureKey: Joi.string().optional()
    });

    const { error } = updateContactSchema.validate({ studentId, ...req.body });

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: HttpStatusCode.BadRequest,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const student = await studentModel.findOne({ studentId });

    if (!student) {
      return res.status(HttpStatusCode.NotFound).json({
        status: HttpStatusCode.NotFound,
        code: HttpStatusCode.NotFound,
        message: responseMessageConstant.USER_NOT_FOUND
      });
    }

    if (contact_number) student.contact_number = contact_number;
    if (personal_email) student.personal_email = personal_email;
    if (department) student.department = department;
    student.isUpdated = true;

    await student.save();

    res.status(HttpStatusCode.Ok).json({
      status: HttpStatusCode.Ok,
      code: HttpStatusCode.Ok,
      message: 'Contact details updated successfully',
      student
    });
  } catch (err: any) {
    console.log(errorLogConstant.studentController.updateContactErrorLog, err.message);
    return res.status(HttpStatusCode.InternalServerError).json({
      status: HttpStatusCode.InternalServerError,
      code: HttpStatusCode.InternalServerError,
      message: 'Error updating contact details'
    });
  }
};

export default updateContactDetails;
