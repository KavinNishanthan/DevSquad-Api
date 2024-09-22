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
exports.handleGetQuestions = void 0;
const joi_1 = __importDefault(require("joi"));
const axios_1 = require("axios");
// Importing models
const mongoose_1 = __importDefault(require("mongoose"));
// Importing constants
const http_message_constant_1 = __importDefault(require("../constants/http-message.constant"));
const response_message_constant_1 = __importDefault(require("../constants/response-message.constant"));
/**
 * @createdBy Kamalesh J
 * @createdAt 2024-09-10
 * @description This function is used to handle get question
 */
const handleGetQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { topic, difficulty } = req.params;
        const verifyParams = joi_1.default.object({
            topic: joi_1.default.string().required(),
            difficulty: joi_1.default.string().required()
        });
        const { error } = verifyParams.validate(req.params);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const questionCollection = mongoose_1.default.connection.collection(topic);
        // Fetch questions based on difficulty level
        const questions = yield questionCollection.find({ difficulty: difficulty }).toArray();
        //No questions found
        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for the specified difficulty level' });
        }
        // Shuffle questions randomly
        const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
        res.status(axios_1.HttpStatusCode.Created).json({
            status: http_message_constant_1.default.CREATED,
            code: axios_1.HttpStatusCode.Created,
            message: response_message_constant_1.default.QUESTIONS_FETCHED_SUCCESSFULLY,
            data: shuffledQuestions
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
exports.handleGetQuestions = handleGetQuestions;
exports.default = {
    handleGetQuestions: exports.handleGetQuestions
};
