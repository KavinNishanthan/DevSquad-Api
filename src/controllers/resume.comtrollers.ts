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
      no_of_current_arrear,
      history_of_arrears,
      department,
      batchId
    } = req.body;

    const { studentId, collegeId } = req.params;

    const resumeValidation = Joi.object({
      studentId: Joi.string().required(),
      collegeId: Joi.string().required()
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
      return res.status(HttpStatusCode.Conflict).json({
        status: httpStatusConstant.CONFLICT,
        code: HttpStatusCode.Conflict,
        message: responseMessageConstant.RESUME_ALREADY_EXISTS
      });
    }

    await resumeModel.create({
      studentId,
      batchId,
      linkedin_profile,
      leetcode_profile,
      department,
      portfolio_url,
      git_hub_url,
      about_me,
      education,
      experience: [],
      projects: [],
      skills: [],
      optin_drives: [],
      optout_drives: [],
      no_of_current_arrear,
      history_of_arrears,
      collegeId
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
      { new: true, runValidators: true, upsert: false }
    );

    if (!updatedResume) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: responseMessageConstant.RESUME_NOT_FOUND
      });
    }

    return res.status(HttpStatusCode.Ok).json({
      status: httpStatusConstant.OK,
      code: HttpStatusCode.Ok
    });
  } catch (err: any) {
    console.log(errorLogConstant.resumeController.updateResumeErrorLog, err.message);
    return res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError
    });
  }
};

/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-04
 * @description This function is used to Add Skill
 */

const addSkills = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { skill_name, test_result } = req.body;

    const verifyStudent = Joi.object({
      studentId: Joi.string().required()
    });

    const { error } = verifyStudent.validate(req.params);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const student = await resumeModel.findOne({ studentId });

    if (!student) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: responseMessageConstant.USER_NOT_FOUND
      });
    }

    student.skills.push({
      skill_name,
      test_result
    });

    await student.save();

    res.status(HttpStatusCode.Created).json({
      status: httpStatusConstant.CREATED,
      code: HttpStatusCode.Created
    });
  } catch (err: any) {
    console.log(errorLogConstant.resumeController.addSkillErrorLog, err.message);
    return res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError
    });
  }
};

const addProject = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { title, description, technologies, project_url, git_hub_url } = req.body;

    const verifyStudent = Joi.object({
      studentId: Joi.string().required()
    });

    const { error } = verifyStudent.validate(req.params);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const student = await resumeModel.findOne({ studentId });

    if (!student) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: responseMessageConstant.USER_NOT_FOUND
      });
    }

    student.projects.push({
      title,
      description,
      technologies,
      ...(project_url && { project_url }),
      ...(git_hub_url && { git_hub_url })
    });

    await student.save();

    res.status(HttpStatusCode.Created).json({
      status: httpStatusConstant.CREATED,
      code: HttpStatusCode.Created
    });
  } catch (err: any) {
    console.log(errorLogConstant.resumeController.addProjectErrorLog, err.message);
    return res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError
    });
  }
};

const deleteProject = async (req: Request, res: Response) => {
  try {
    const { studentId, projectId } = req.params;

    const verifyParams = Joi.object({
      studentId: Joi.string().required(),
      projectId: Joi.string().required()
    });

    const { error } = verifyParams.validate(req.params);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const student = await resumeModel.findOne({ studentId });

    if (!student) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: responseMessageConstant.USER_NOT_FOUND
      });
    }

    const projectIndex = student.projects.findIndex((project: any) => project._id.toString() === projectId);

    if (projectIndex === -1) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: 'Project not found'
      });
    }

    student.projects.splice(projectIndex, 1);

    await student.save();

    res.status(HttpStatusCode.Ok).json({
      status: httpStatusConstant.OK,
      code: HttpStatusCode.Ok,
      message: 'Project deleted successfully'
    });
  } catch (err: any) {
    console.log(errorLogConstant.resumeController.deleteProjectErrorLog, err.message);
    return res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError
    });
  }
};

const addExperience = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { company, role, technologies, duration } = req.body;

    const verifyStudent = Joi.object({
      studentId: Joi.string().required()
    });

    const { error } = verifyStudent.validate(req.params);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const student = await resumeModel.findOne({ studentId });

    if (!student) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: responseMessageConstant.USER_NOT_FOUND
      });
    }

    student.experience.push({
      company,
      role,
      technologies,
      duration
    });

    await student.save();

    res.status(HttpStatusCode.Created).json({
      status: httpStatusConstant.CREATED,
      code: HttpStatusCode.Created,
      message: 'Experience added successfully'
    });
  } catch (err: any) {
    console.log(errorLogConstant.resumeController.addExperienceErrorLog, err.message);
    return res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError
    });
  }
};

const deleteExperience = async (req: Request, res: Response) => {
  try {
    const { studentId, experienceId } = req.params;

    const verifyParams = Joi.object({
      studentId: Joi.string().required(),
      experienceId: Joi.string().required()
    });

    const { error } = verifyParams.validate(req.params);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const student = await resumeModel.findOne({ studentId });

    if (!student) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: responseMessageConstant.USER_NOT_FOUND
      });
    }

    const experienceIndex = student.experience.findIndex((exp: any) => exp._id.toString() === experienceId);

    if (experienceIndex === -1) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: 'Experience not found'
      });
    }

    student.experience.splice(experienceIndex, 1);

    await student.save();

    res.status(HttpStatusCode.Ok).json({
      status: httpStatusConstant.OK,
      code: HttpStatusCode.Ok,
      message: 'Experience deleted successfully'
    });
  } catch (err: any) {
    console.log(errorLogConstant.resumeController.deleteExperienceErrorLog, err.message);
    return res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError
    });
  }
};

const addAreaOfInterest = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { area_of_interest } = req.body;

    const verifyUpdate = Joi.object({
      studentId: Joi.string().required(),
      area_of_interest: Joi.string().required()
    });

    const { error } = verifyUpdate.validate({ studentId, area_of_interest });

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const student = await resumeModel.findOne({ studentId });

    if (!student) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: responseMessageConstant.USER_NOT_FOUND
      });
    }

    student.area_of_interest.push(area_of_interest);

    await student.save();

    res.status(HttpStatusCode.Ok).json({
      status: httpStatusConstant.OK,
      code: HttpStatusCode.Ok,
      message: 'Area of Interest updated successfully'
    });
  } catch (err: any) {
    console.log(errorLogConstant.resumeController.updateAreaOfInterestErrorLog, err.message);
    return res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError
    });
  }
};

const deleteAreaOfInterest = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { area_of_interest } = req.body;

    const verifyDelete = Joi.object({
      studentId: Joi.string().required(),
      area_of_interest: Joi.string().required()
    });

    const { error } = verifyDelete.validate({ studentId, area_of_interest });

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const student = await resumeModel.findOneAndUpdate(
      { studentId },
      { $pull: { area_of_interest: area_of_interest } },
      { new: true }
    );

    if (!student) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: responseMessageConstant.USER_NOT_FOUND
      });
    }

    res.status(HttpStatusCode.Ok).json({
      status: httpStatusConstant.OK,
      code: HttpStatusCode.Ok,
      message: 'Area of Interest deleted successfully'
    });
  } catch (err: any) {
    console.log(errorLogConstant.resumeController.deleteAreaOfInterestErrorLog, err.message);
    return res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError
    });
  }
};

const getResume = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    // Validate studentId
    const verifyStudent = Joi.object({
      studentId: Joi.string().required()
    });

    const { error } = verifyStudent.validate({ studentId });

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const student = await resumeModel.findOne({ studentId });

    if (!student) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: responseMessageConstant.USER_NOT_FOUND
      });
    }

    res.status(HttpStatusCode.Ok).json({
      status: httpStatusConstant.OK,
      code: HttpStatusCode.Ok,
      resume: student
    });
  } catch (err: any) {
    console.log(errorLogConstant.resumeController.getResumeErrorLog, err.message);
    return res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError
    });
  }
};

export default {
  getResume,
  createResume,
  updateResume,
  addSkills,
  addProject,
  deleteProject,
  addExperience,
  deleteExperience,
  addAreaOfInterest,
  deleteAreaOfInterest
};
