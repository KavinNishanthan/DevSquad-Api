// Importing packges
import Joi from 'joi';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';

// Importing models
import resumeModel from '../models/resume.model';

// Importing constants
import errorLogConstant from '../constants/error-log.constant';
import httpStatusConstant from '../constants/http-message.constant';
import responseMessageConstant from '../constants/response-message.constant';

/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-04
 * @description This function is used to Create Resume
 */

const createResume = async (req: Request, res: Response) => {
  try {
    const {
      linkedin_profile,
      leetcode_profile,
      portfolio_url,
      git_hub_url,
      about_me,
      education,
      experience,
      projects,
      skills,
      optin_drives,
      optout_drives,
      placementStatus,
      placedCompany
    } = req.body;

    const { studentId } = req.params;

    const resumeValidation = Joi.object({
      studentId: Joi.string().required()
    });

    const { error } = resumeValidation.validate(req.params);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const existingResume = await resumeModel.findOne({ studentId });

    if (existingResume) {
      res.status(HttpStatusCode.Conflict).json({
        status: httpStatusConstant.CONFLICT,
        code: HttpStatusCode.Conflict,
        message: responseMessageConstant.RESUME_ALREADY_EXISTS
      });
    }

    await resumeModel.create({
      studentId,
      linkedin_profile,
      leetcode_profile,
      portfolio_url,
      git_hub_url,
      about_me,
      education,
      experience: experience || [],
      projects: projects || [],
      skills: skills || [],
      optin_drives: optin_drives || [],
      optout_drives: optout_drives || [],
      placementStatus,
      placedCompany
    });

    res.status(HttpStatusCode.Created).json({
      status: httpStatusConstant.CREATED,
      code: HttpStatusCode.Created
    });
  } catch (err: any) {
    console.log(errorLogConstant.resumeController.createResumeErrorLog, err.message);
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ status: httpStatusConstant.ERROR, code: HttpStatusCode.InternalServerError });
  }
};

/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-04
 * @description This function is used to Update Resume
 */

const updateResume = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const updateData = req.body;

    const resumeValidation = Joi.object({
      studentId: Joi.string().required()
    });

    const { error } = resumeValidation.validate(req.params);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const updatedResume = await resumeModel.findOneAndUpdate(
      { studentId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedResume) {
      res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: responseMessageConstant.RESUME_NOT_FOUND
      });
    }

    res.status(HttpStatusCode.Ok).json({
      status: httpStatusConstant.OK,
      code: HttpStatusCode.Ok
    });
  } catch (err: any) {
    console.log(errorLogConstant.resumeController.updateResumeErrorLog, err.message);
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ status: httpStatusConstant.ERROR, code: HttpStatusCode.InternalServerError });
  }
};

export default {
  createResume,
  updateResume
};
