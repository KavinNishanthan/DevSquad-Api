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
exports.verifyUser = void 0;
// Importing packages
const axios_1 = require("axios");
// Importing models
const student_model_1 = __importDefault(require("../models/student.model"));
// Importing constants
const http_message_constant_1 = __importDefault(require("../constants/http-message.constant"));
const response_message_constant_1 = __importDefault(require("../constants/response-message.constant"));
// Importing helpers
const jwt_helper_1 = require("../helpers/jwt.helper");
const cookie_helper_1 = require("../helpers/cookie.helper");
/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-08-28
 * @description This function is used to handle verify user
 */
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.cookie) {
            return res.status(axios_1.HttpStatusCode.Unauthorized).json({
                status: http_message_constant_1.default.UNAUTHORIZED,
                code: axios_1.HttpStatusCode.Unauthorized
            });
        }
        const accessToken = (0, cookie_helper_1.getSkillTrackSignature)(req.headers.cookie);
        if (!accessToken) {
            return res.status(axios_1.HttpStatusCode.Unauthorized).json({
                status: http_message_constant_1.default.UNAUTHORIZED,
                code: axios_1.HttpStatusCode.Unauthorized
            });
        }
        else {
            const decodedToken = yield (0, jwt_helper_1.verifyToken)(accessToken);
            if (!decodedToken) {
                return res.status(axios_1.HttpStatusCode.Unauthorized).json({
                    status: http_message_constant_1.default.UNAUTHORIZED,
                    code: axios_1.HttpStatusCode.Unauthorized
                });
            }
            const userResponse = yield student_model_1.default
                .findOne({
                studentId: decodedToken.studentId,
                isActive: true
            })
                .select('-password -_id -isManualAuth -createdAt -updatedAt -googleId -__v');
            req.userSession = decodedToken;
            next();
        }
    }
    catch (err) {
        res.status(axios_1.HttpStatusCode.Unauthorized).json({
            status: http_message_constant_1.default.UNAUTHORIZED,
            code: axios_1.HttpStatusCode.Unauthorized,
            message: response_message_constant_1.default.INVALID_TOKEN
        });
    }
});
exports.verifyUser = verifyUser;
exports.default = exports.verifyUser;
