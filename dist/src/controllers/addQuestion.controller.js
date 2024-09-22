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
exports.handleAddQuestions = void 0;
const joi_1 = __importDefault(require("joi"));
const axios_1 = require("axios");
// Importing models
const questions_model_1 = require("../models/questions.model");
// Importing constants
const http_message_constant_1 = __importDefault(require("../constants/http-message.constant"));
const response_message_constant_1 = __importDefault(require("../constants/response-message.constant"));
/**
 * @createdBy Kamalesh J
 * @createdAt 2024-09-10
 * @description This function is used to handle add question
 */
const handleAddQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, questions } = req.body;
        console.log(name, questions);
        // Joi validation schema
        const questionValidation = joi_1.default.object({
            name: joi_1.default.string().required(),
            questions: joi_1.default.array().items(joi_1.default.object({
                difficulty: joi_1.default.string().required(),
                question: joi_1.default.string().required(),
                options: joi_1.default.array().items(joi_1.default.string()).min(2).required(),
                answer: joi_1.default.string().required()
            })).required()
        });
        // Validate the request body
        const { error } = questionValidation.validate(req.body);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        // Create or use an existing collection based on the `name` provided
        const QuestionModel = (0, questions_model_1.createDynamicModel)(name);
        // Insert all questions as separate documents into the collection
        const insertedQuestions = yield QuestionModel.insertMany(questions);
        res.status(axios_1.HttpStatusCode.Created).json({
            status: http_message_constant_1.default.CREATED,
            code: axios_1.HttpStatusCode.Created,
            message: response_message_constant_1.default.QUESTIONS_ADDED_SUCCESSFULLY
        });
    }
    catch (err) {
        console.error('Error in handleAddQuestions:', err.message);
        res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError,
            message: response_message_constant_1.default.INTERNAL_SERVER_ERROR
        });
    }
});
exports.handleAddQuestions = handleAddQuestions;
exports.default = {
    handleAddQuestions: exports.handleAddQuestions
};
