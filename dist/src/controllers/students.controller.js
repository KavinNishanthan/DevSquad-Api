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
const student_model_1 = __importDefault(require("../models/student.model"));
const error_log_constant_1 = __importDefault(require("../constants/error-log.constant"));
const response_message_constant_1 = __importDefault(require("../constants/response-message.constant"));
const updateContactDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const { contact_number, personal_email, department } = req.body;
        // Joi validation schema for updating contact details
        const updateContactSchema = joi_1.default.object({
            studentId: joi_1.default.string().required(),
            contact_number: joi_1.default.string().optional(),
            personal_email: joi_1.default.string().email().optional(),
            department: joi_1.default.string().optional(),
            profilePictureUrl: joi_1.default.string().optional(),
            profilePictureKey: joi_1.default.string().optional()
        });
        const { error } = updateContactSchema.validate(Object.assign({ studentId }, req.body));
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: axios_1.HttpStatusCode.BadRequest,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const student = yield student_model_1.default.findOne({ studentId });
        if (!student) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: axios_1.HttpStatusCode.NotFound,
                code: axios_1.HttpStatusCode.NotFound,
                message: response_message_constant_1.default.USER_NOT_FOUND
            });
        }
        if (contact_number)
            student.contact_number = contact_number;
        if (personal_email)
            student.personal_email = personal_email;
        if (department)
            student.department = department;
        student.isUpdated = true;
        yield student.save();
        res.status(axios_1.HttpStatusCode.Ok).json({
            status: axios_1.HttpStatusCode.Ok,
            code: axios_1.HttpStatusCode.Ok,
            message: 'Contact details updated successfully',
            student
        });
    }
    catch (err) {
        console.log(error_log_constant_1.default.studentController.updateContactErrorLog, err.message);
        return res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: axios_1.HttpStatusCode.InternalServerError,
            code: axios_1.HttpStatusCode.InternalServerError,
            message: 'Error updating contact details'
        });
    }
});
exports.default = updateContactDetails;
