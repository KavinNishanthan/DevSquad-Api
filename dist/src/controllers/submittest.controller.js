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
const axios_1 = require("axios");
// Importing model
const resume_model_1 = __importDefault(require("../models/resume.model"));
const http_message_constant_1 = __importDefault(require("../constants/http-message.constant"));
const response_message_constant_1 = __importDefault(require("../constants/response-message.constant"));
/**
 * @createdBy Kamalesh J
 * @createdAt 2024-09-15
 * @description This function is used to handle submit test
 */
const handlesubmit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const { skill_name, test_result, level } = req.body;
        const findStudent = yield resume_model_1.default.findOne({ studentId });
        if (findStudent) {
            findStudent.skills.push({ skill_name, test_result, level });
            // Save the updated document
            yield findStudent.save();
            res.status(axios_1.HttpStatusCode.Created).json({
                status: http_message_constant_1.default.CREATED,
                code: axios_1.HttpStatusCode.Created,
                message: response_message_constant_1.default.SUBMITTED_SUCCESSFULLY
            });
        }
    }
    catch (error) {
        return res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: axios_1.HttpStatusCode.InternalServerError,
            code: axios_1.HttpStatusCode.InternalServerError,
            message: 'Error in submitting test details'
        });
    }
});
exports.default = { handlesubmit };
