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
// Importing models
const drive_model_1 = __importDefault(require("../models/drive.model"));
const error_log_constant_1 = __importDefault(require("../constants/error-log.constant"));
const http_message_constant_1 = __importDefault(require("../constants/http-message.constant"));
const createDrive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collegeId, companyName, driveDate, requirements, rolesAndSalary, numberOfRounds, companyLocation, roundDetails, eligibleBatch, eligibleDepartments, eligibilityCriteria } = req.body;
        const driveValidationSchema = joi_1.default.object({
            collegeId: joi_1.default.string().required(),
            companyName: joi_1.default.string().required(),
            driveDate: joi_1.default.date().required(),
            requirements: joi_1.default.array().items(joi_1.default.string()).required(),
            rolesAndSalary: joi_1.default.array()
                .items(joi_1.default.object({
                role: joi_1.default.string().required(),
                salary: joi_1.default.number().required()
            }))
                .required(),
            numberOfRounds: joi_1.default.number().required(),
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
                noHistoryOfArrears: joi_1.default.boolean().required(),
                maxArrears: joi_1.default.number().required()
            }).required()
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
            requirements,
            rolesAndSalary,
            numberOfRounds,
            companyLocation,
            roundDetails,
            eligibleBatch,
            eligibleDepartments,
            eligibilityCriteria
        });
        yield newDrive.save();
        res.status(axios_1.HttpStatusCode.Created).json({
            status: http_message_constant_1.default.CREATED,
            code: axios_1.HttpStatusCode.Created,
            message: 'Drive created successfully!'
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
        const { driveId } = req.params;
        if (!driveId) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: 'Drive ID is required'
            });
        }
        const drive = yield drive_model_1.default.findByIdAndDelete(driveId);
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
exports.default = {
    createDrive,
    deleteDrive
};
