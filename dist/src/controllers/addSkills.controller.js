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
const axios_1 = require("axios");
//Import model
const addskill_model_1 = __importDefault(require("../models/addskill.model"));
// Importing constants
const http_message_constant_1 = __importDefault(require("../constants/http-message.constant"));
/**
 * @createdBy Kamalesh J
 * @createdAt 2024-10-05
 * @description This function is used to handle add skills from admin side
 */
const handleAddNewSkills = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { skill_name } = req.body;
        if (typeof skill_name !== 'string') {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.ERROR,
                code: axios_1.HttpStatusCode.BadRequest,
                message: 'Invalid skill_name format. Expected a string.'
            });
        }
        const newSkillsDocument = new addskill_model_1.default({
            skill_name: skill_name
        });
        yield newSkillsDocument.save();
        res.status(axios_1.HttpStatusCode.Created).json({
            status: http_message_constant_1.default.CREATED,
            code: axios_1.HttpStatusCode.Created
        });
    }
    catch (error) {
        console.log(error);
        return res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError
        });
    }
});
/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-10-07
 * @description This function is used to handle add skills from admin side
 */
const handleGetAllSkills = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skills = yield addskill_model_1.default.find({});
        res.status(axios_1.HttpStatusCode.Ok).json({
            status: http_message_constant_1.default.SUCCESS,
            code: axios_1.HttpStatusCode.Ok,
            data: skills
        });
    }
    catch (error) {
        console.log(error);
        return res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError,
            message: 'Failed to fetch skills. Please try again later.'
        });
    }
});
exports.default = {
    handleAddNewSkills,
    handleGetAllSkills
};
