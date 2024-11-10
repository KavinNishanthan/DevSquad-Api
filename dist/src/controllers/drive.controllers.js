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
const uuid_helper_1 = require("../helpers/uuid.helper");
const filterStudents_helper_1 = require("../helpers/filterStudents.helper");
// Importing models
const drive_model_1 = __importDefault(require("../models/drive.model"));
const error_log_constant_1 = __importDefault(require("../constants/error-log.constant"));
const http_message_constant_1 = __importDefault(require("../constants/http-message.constant"));
const student_model_1 = __importDefault(require("../models/student.model"));
const createDrive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyName, driveDate, jobType, rolesAndSalary, companyLocation, roundDetails, eligibleBatch, eligibleDepartments, eligibilityCriteria, techStackEligibility } = req.body;
        const { collegeId } = req.params;
        if (!collegeId) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: 'College ID is required'
            });
        }
        const driveValidationSchema = joi_1.default.object({
            companyName: joi_1.default.string().required(),
            driveDate: joi_1.default.date().required(),
            jobType: joi_1.default.string().required(),
            rolesAndSalary: joi_1.default.array()
                .items(joi_1.default.object({
                role: joi_1.default.string().required(),
                salary: joi_1.default.number().required()
            }))
                .required(),
            companyLocation: joi_1.default.string().required(),
            roundDetails: joi_1.default.array()
                .items(joi_1.default.object({
                roundNumber: joi_1.default.number().required(),
                description: joi_1.default.string().required(),
                venue: joi_1.default.string().required()
            }))
                .required(),
            eligibleBatch: joi_1.default.array().items(joi_1.default.number()).required(),
            eligibleDepartments: joi_1.default.array().items(joi_1.default.string()).required(),
            eligibilityCriteria: joi_1.default.object({
                minTenthMarks: joi_1.default.number().required(),
                minTwelfthMarks: joi_1.default.number().required(),
                minCGPA: joi_1.default.number().required(),
                noHistoryOfArrears: joi_1.default.number().required(),
                maxArrears: joi_1.default.number().required()
            }).required(),
            techStackEligibility: joi_1.default.object({
                isTechStackRequired: joi_1.default.boolean().required(),
                requiredSkills: joi_1.default.array().items(joi_1.default.string()).when('isTechStackRequired', {
                    is: true,
                    then: joi_1.default.required(),
                    otherwise: joi_1.default.optional()
                })
            }),
        });
        const { error } = driveValidationSchema.validate(req.body);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const generatedCompanyId = (0, uuid_helper_1.generateUUID)();
        const newDrive = new drive_model_1.default({
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
        yield newDrive.save();
        yield (0, filterStudents_helper_1.filterEligibleStudents)(generatedCompanyId);
        res.status(axios_1.HttpStatusCode.Created).json({
            status: http_message_constant_1.default.CREATED,
            code: axios_1.HttpStatusCode.Created,
            message: 'Drive created and eligible students filtered successfully!'
        });
    }
    catch (err) {
        console.log(error_log_constant_1.default.driveController.createDriveErrorLog, err.message);
        return res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError,
            message: 'Error creating drive'
        });
    }
});
const deleteDrive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyId } = req.params;
        if (!companyId) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: 'Drive ID is required'
            });
        }
        const drive = yield drive_model_1.default.findOneAndDelete({ companyId });
        if (!drive) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: 'Drive not found'
            });
        }
        res.status(axios_1.HttpStatusCode.Ok).json({
            status: http_message_constant_1.default.OK,
            code: axios_1.HttpStatusCode.Ok,
            message: 'Drive deleted successfully'
        });
    }
    catch (err) {
        console.log(error_log_constant_1.default.driveController.deleteDriveErrorLog, err.message);
        return res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError,
            message: 'Error deleting drive'
        });
    }
});
const getDrives = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collegeId } = req.params;
        const validateRequest = joi_1.default.object({
            collegeId: joi_1.default.string().required()
        });
        const { error } = validateRequest.validate(req.params);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const drives = yield drive_model_1.default.find({ collegeId });
        if (drives.length === 0) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: 'No drives found for the provided college ID'
            });
        }
        res.status(axios_1.HttpStatusCode.Ok).json({
            status: http_message_constant_1.default.SUCCESS,
            code: axios_1.HttpStatusCode.Ok,
            message: 'Drives fetched successfully!',
            data: drives
        });
    }
    catch (err) {
        console.log(error_log_constant_1.default.driveController.getDrivesErrorLog, err.message);
        return res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError,
            message: 'Internal server error'
        });
    }
});
const handleOptInDrive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId, companyId } = req.params;
        const optInValidationSchema = joi_1.default.object({
            studentId: joi_1.default.string().required(),
            companyId: joi_1.default.string().required()
        });
        const { error } = optInValidationSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ message: error.details[0].message.replace(/"/g, '') });
        }
        const drive = yield drive_model_1.default.findOne({ companyId });
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
        yield drive.save();
        return res.status(200).json({ message: 'Student successfully opted in for the drive' });
    }
    catch (err) {
        console.log(error_log_constant_1.default.driveController.handleOptInDrivesErrorLog, err.message);
        return res.status(500).json({
            status: http_message_constant_1.default.ERROR,
            code: 500,
            message: 'Internal server error'
        });
    }
});
const handleOptOutDrive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId, companyId } = req.params;
        const optOutValidationSchema = joi_1.default.object({
            studentId: joi_1.default.string().required(),
            companyId: joi_1.default.string().required()
        });
        const { error } = optOutValidationSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ message: error.details[0].message.replace(/"/g, '') });
        }
        const drive = yield drive_model_1.default.findOne({ companyId });
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
        yield drive.save();
        return res.status(200).json({ message: 'Student successfully opted out of the drive' });
    }
    catch (err) {
        console.log(error_log_constant_1.default.driveController.handleOptOutDrivesErrorLog, err.message);
        return res.status(500).json({
            status: http_message_constant_1.default.ERROR,
            code: 500,
            message: 'Internal server error'
        });
    }
});
const fetchOptedStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchOptedStudentsSchema = joi_1.default.object({
            companyId: joi_1.default.string().required()
        });
        const { error } = fetchOptedStudentsSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { companyId } = req.params;
        const drive = yield drive_model_1.default.findOne({ companyId });
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }
        const optedStudentsIds = drive.optedStudents;
        if (optedStudentsIds.length === 0) {
            return res.status(200).json({ message: 'No students have opted in for this drive' });
        }
        const studentsDetails = yield student_model_1.default.find({ studentId: { $in: optedStudentsIds } }, {
            name: 1,
            email: 1,
            register_number: 1,
            department: 1,
            contact_number: 1
        });
        if (studentsDetails.length === 0) {
            return res.status(404).json({ message: 'No students found for the opted IDs' });
        }
        return res.status(200).json(studentsDetails);
    }
    catch (err) {
        console.log(error_log_constant_1.default.driveController.fetchOptedStudentsDetailsErrorLog, err.message);
        return res.status(500).json({
            status: http_message_constant_1.default.ERROR,
            code: 500,
            message: 'Internal server error'
        });
    }
});
const fetchOptedOutStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchOptedOutStudentsSchema = joi_1.default.object({
            companyId: joi_1.default.string().required()
        });
        const { error } = fetchOptedOutStudentsSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { companyId } = req.params;
        const drive = yield drive_model_1.default.findOne({ companyId });
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }
        const optedOutStudentsIds = drive.optedOutStudents;
        if (optedOutStudentsIds.length === 0) {
            return res.status(200).json({ message: 'No students have opted out for this drive' });
        }
        const studentsDetails = yield student_model_1.default.find({ studentId: { $in: optedOutStudentsIds } }, {
            name: 1,
            email: 1,
            register_number: 1,
            department: 1,
            contact_number: 1
        });
        if (studentsDetails.length === 0) {
            return res.status(404).json({ message: 'No students found for the opted-out IDs' });
        }
        return res.status(200).json(studentsDetails);
    }
    catch (err) {
        console.log(error_log_constant_1.default.driveController.fetchOptedOutStudentsDetailsErrorLog, err.message);
        return res.status(500).json({
            status: http_message_constant_1.default.ERROR,
            code: 500,
            message: 'Internal server error'
        });
    }
});
const updatePlacedStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyId, studentId } = req.params;
        const schema = joi_1.default.object({
            studentId: joi_1.default.string().required(),
            companyId: joi_1.default.string().required()
        });
        const { error } = schema.validate(req.params);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const drive = yield drive_model_1.default.findOne({ companyId });
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }
        if (drive.placedStudents.includes(studentId)) {
            return res.status(400).json({ message: 'Student already marked as placed for this drive' });
        }
        drive.placedStudents.push(studentId);
        yield drive.save();
        return res.status(200).json({
            message: 'Student successfully added to placed students list',
            placedStudents: drive.placedStudents
        });
    }
    catch (err) {
        console.error('Error updating placed students:', err.message);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});
exports.default = {
    createDrive,
    deleteDrive,
    getDrives,
    handleOptInDrive,
    handleOptOutDrive,
    fetchOptedStudents,
    fetchOptedOutStudents,
    updatePlacedStudents
};
