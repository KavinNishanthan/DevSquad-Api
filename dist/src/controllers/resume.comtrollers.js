"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packges
const joi_1 = __importDefault(require("joi"));
const axios_1 = require("axios");
// Importing models
const resume_model_1 = __importDefault(require("../models/resume.model"));
// Importing constants
const error_log_constant_1 = __importDefault(require("../constants/error-log.constant"));
const http_message_constant_1 = __importDefault(require("../constants/http-message.constant"));
const response_message_constant_1 = __importDefault(require("../constants/response-message.constant"));
/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-04
 * @description This function is used to Create Resume
 */
const createResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { linkedin_profile, leetcode_profile, portfolio_url, git_hub_url, about_me, education, no_of_current_arrear, history_of_arrears, department, batchId } = req.body;
        const { studentId, collegeId } = req.params;
        const resumeValidation = joi_1.default.object({
            studentId: joi_1.default.string().required(),
            collegeId: joi_1.default.string().required()
        });
        const { error } = resumeValidation.validate(req.params);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const existingResume = yield resume_model_1.default.findOne({ studentId });
        if (existingResume) {
            return res.status(axios_1.HttpStatusCode.Conflict).json({
                status: http_message_constant_1.default.CONFLICT,
                code: axios_1.HttpStatusCode.Conflict,
                message: response_message_constant_1.default.RESUME_ALREADY_EXISTS
            });
        }
        yield resume_model_1.default.create({
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
        res.status(axios_1.HttpStatusCode.Created).json({
            status: http_message_constant_1.default.CREATED,
            code: axios_1.HttpStatusCode.Created
        });
    }
    catch (err) {
        console.log(error_log_constant_1.default.resumeController.createResumeErrorLog, err.message);
        res
            .status(axios_1.HttpStatusCode.InternalServerError)
            .json({ status: http_message_constant_1.default.ERROR, code: axios_1.HttpStatusCode.InternalServerError });
    }
});
/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-04
 * @description This function is used to Update Resume
 */
const updateResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const updateData = req.body;
        const resumeValidation = joi_1.default.object({
            studentId: joi_1.default.string().required()
        });
        const { error } = resumeValidation.validate(req.params);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const updatedResume = yield resume_model_1.default.findOneAndUpdate({ studentId }, { $set: updateData }, { new: true, runValidators: true, upsert: false });
        if (!updatedResume) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: response_message_constant_1.default.RESUME_NOT_FOUND
            });
        }
        return res.status(axios_1.HttpStatusCode.Ok).json({
            status: http_message_constant_1.default.OK,
            code: axios_1.HttpStatusCode.Ok
        });
    }
    catch (err) {
        console.log(error_log_constant_1.default.resumeController.updateResumeErrorLog, err.message);
        return res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError
        });
    }
});
/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-04
 * @description This function is used to Add Skill
 */
const addSkills = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const { skill_name, test_result, level } = req.body;
        const verifyStudent = joi_1.default.object({
            studentId: joi_1.default.string().required()
        });
        const { error } = verifyStudent.validate(req.params);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const student = yield resume_model_1.default.findOne({ studentId });
        if (!student) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: response_message_constant_1.default.USER_NOT_FOUND
            });
        }
        student.skills.push({
            skill_name,
            test_result,
            level,
        });
        yield student.save();
        res.status(axios_1.HttpStatusCode.Created).json({
            status: http_message_constant_1.default.CREATED,
            code: axios_1.HttpStatusCode.Created
        });
    }
    catch (err) {
        console.log(error_log_constant_1.default.resumeController.addSkillErrorLog, err.message);
        return res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError
        });
    }
});
const addProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const { title, description, technologies, project_url, git_hub_url } = req.body;
        const verifyStudent = joi_1.default.object({
            studentId: joi_1.default.string().required()
        });
        const { error } = verifyStudent.validate(req.params);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const student = yield resume_model_1.default.findOne({ studentId });
        if (!student) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: response_message_constant_1.default.USER_NOT_FOUND
            });
        }
        student.projects.push(Object.assign(Object.assign({ title,
            description,
            technologies }, (project_url && { project_url })), (git_hub_url && { git_hub_url })));
        yield student.save();
        res.status(axios_1.HttpStatusCode.Created).json({
            status: http_message_constant_1.default.CREATED,
            code: axios_1.HttpStatusCode.Created
        });
    }
    catch (err) {
        console.log(error_log_constant_1.default.resumeController.addProjectErrorLog, err.message);
        return res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError
        });
    }
});
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId, projectId } = req.params;
        const verifyParams = joi_1.default.object({
            studentId: joi_1.default.string().required(),
            projectId: joi_1.default.string().required()
        });
        const { error } = verifyParams.validate(req.params);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const student = yield resume_model_1.default.findOne({ studentId });
        if (!student) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: response_message_constant_1.default.USER_NOT_FOUND
            });
        }
        const projectIndex = student.projects.findIndex((project) => project._id.toString() === projectId);
        if (projectIndex === -1) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: 'Project not found'
            });
        }
        student.projects.splice(projectIndex, 1);
        yield student.save();
        res.status(axios_1.HttpStatusCode.Ok).json({
            status: http_message_constant_1.default.OK,
            code: axios_1.HttpStatusCode.Ok,
            message: 'Project deleted successfully'
        });
    }
    catch (err) {
        console.log(error_log_constant_1.default.resumeController.deleteProjectErrorLog, err.message);
        return res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError
        });
    }
});
const addExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const { company, role, technologies, duration } = req.body;
        const verifyStudent = joi_1.default.object({
            studentId: joi_1.default.string().required()
        });
        const { error } = verifyStudent.validate(req.params);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const student = yield resume_model_1.default.findOne({ studentId });
        if (!student) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: response_message_constant_1.default.USER_NOT_FOUND
            });
        }
        student.experience.push({
            company,
            role,
            technologies,
            duration
        });
        yield student.save();
        res.status(axios_1.HttpStatusCode.Created).json({
            status: http_message_constant_1.default.CREATED,
            code: axios_1.HttpStatusCode.Created,
            message: 'Experience added successfully'
        });
    }
    catch (err) {
        console.log(error_log_constant_1.default.resumeController.addExperienceErrorLog, err.message);
        return res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError
        });
    }
});
const deleteExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId, experienceId } = req.params;
        const verifyParams = joi_1.default.object({
            studentId: joi_1.default.string().required(),
            experienceId: joi_1.default.string().required()
        });
        const { error } = verifyParams.validate(req.params);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const student = yield resume_model_1.default.findOne({ studentId });
        if (!student) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: response_message_constant_1.default.USER_NOT_FOUND
            });
        }
        const experienceIndex = student.experience.findIndex((exp) => exp._id.toString() === experienceId);
        if (experienceIndex === -1) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: 'Experience not found'
            });
        }
        student.experience.splice(experienceIndex, 1);
        yield student.save();
        res.status(axios_1.HttpStatusCode.Ok).json({
            status: http_message_constant_1.default.OK,
            code: axios_1.HttpStatusCode.Ok,
            message: 'Experience deleted successfully'
        });
    }
    catch (err) {
        console.log(error_log_constant_1.default.resumeController.deleteExperienceErrorLog, err.message);
        return res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError
        });
    }
});
const addAreaOfInterest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const { area_of_interest } = req.body;
        const verifyUpdate = joi_1.default.object({
            studentId: joi_1.default.string().required(),
            area_of_interest: joi_1.default.string().required()
        });
        const { error } = verifyUpdate.validate({ studentId, area_of_interest });
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const student = yield resume_model_1.default.findOne({ studentId });
        if (!student) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: response_message_constant_1.default.USER_NOT_FOUND
            });
        }
        student.area_of_interest.push(area_of_interest);
        yield student.save();
        res.status(axios_1.HttpStatusCode.Ok).json({
            status: http_message_constant_1.default.OK,
            code: axios_1.HttpStatusCode.Ok,
            message: 'Area of Interest updated successfully'
        });
    }
    catch (err) {
        console.log(error_log_constant_1.default.resumeController.updateAreaOfInterestErrorLog, err.message);
        return res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError
        });
    }
});
const deleteAreaOfInterest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const { area_of_interest } = req.body;
        const verifyDelete = joi_1.default.object({
            studentId: joi_1.default.string().required(),
            area_of_interest: joi_1.default.string().required()
        });
        const { error } = verifyDelete.validate({ studentId, area_of_interest });
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const student = yield resume_model_1.default.findOneAndUpdate({ studentId }, { $pull: { area_of_interest: area_of_interest } }, { new: true });
        if (!student) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: response_message_constant_1.default.USER_NOT_FOUND
            });
        }
        res.status(axios_1.HttpStatusCode.Ok).json({
            status: http_message_constant_1.default.OK,
            code: axios_1.HttpStatusCode.Ok,
            message: 'Area of Interest deleted successfully'
        });
    }
    catch (err) {
        console.log(error_log_constant_1.default.resumeController.deleteAreaOfInterestErrorLog, err.message);
        return res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError
        });
    }
});
const getResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        // Validate studentId
        const verifyStudent = joi_1.default.object({
            studentId: joi_1.default.string().required()
        });
        const { error } = verifyStudent.validate({ studentId });
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const student = yield resume_model_1.default.findOne({ studentId });
        if (!student) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: response_message_constant_1.default.USER_NOT_FOUND
            });
        }
        res.status(axios_1.HttpStatusCode.Ok).json({
            status: http_message_constant_1.default.OK,
            code: axios_1.HttpStatusCode.Ok,
            resume: student
        });
    }
    catch (err) {
        console.log(error_log_constant_1.default.resumeController.getResumeErrorLog, err.message);
        return res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError
        });
    }
});
/**
 * @createdBy Kamalesh J
 * @createdAt 2024-10-04
 * @description This function is used to update Skill
 */
const updateSkills = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const updateData = req.body;
        const verifyStudent = joi_1.default.object({
            studentId: joi_1.default.string().required()
        });
        const { error } = verifyStudent.validate(req.params);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const updatedSkill = yield resume_model_1.default.findOneAndUpdate({ studentId, "skills.skill_name": updateData.skill_name }, { $set: {
                "skills.$.test_result": updateData.test_result,
                "skills.$.level": updateData.level
            } }, { new: true, runValidators: true, upsert: false });
        if (!updatedSkill) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: response_message_constant_1.default.RESUME_NOT_FOUND
            });
        }
        res.status(axios_1.HttpStatusCode.Ok).json({
            status: http_message_constant_1.default.OK,
            code: axios_1.HttpStatusCode.Ok
        });
    }
    catch (err) {
        console.log(error_log_constant_1.default.resumeController.addSkillErrorLog, err.message);
        return res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError
        });
    }
});
exports.default = {
    getResume,
    createResume,
    updateResume,
    addSkills,
    updateSkills,
    addProject,
    deleteProject,
    addExperience,
    deleteExperience,
    addAreaOfInterest,
    deleteAreaOfInterest
};
