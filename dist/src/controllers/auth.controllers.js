"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const axios_1 = require("axios");
const uuid_helper_1 = require("../helpers/uuid.helper");
// Importing models
const student_model_1 = __importDefault(require("../models/student.model"));
const college_model_1 = __importDefault(require("../models/college.model"));
const jwt_token_model_1 = __importDefault(require("../models/jwt-token.model"));
// Importing constants
const common_constant_1 = __importDefault(require("../constants/common.constant"));
const error_log_constant_1 = __importDefault(require("../constants/error-log.constant"));
const http_message_constant_1 = __importDefault(require("../constants/http-message.constant"));
const response_message_constant_1 = __importDefault(require("../constants/response-message.constant"));
// Importing Helpers
const jwt_helper_1 = require("../helpers/jwt.helper");
const cookie_helper_1 = require("../helpers/cookie.helper");
// Import the multer middleware
const XLSX = __importStar(require("xlsx"));
const fs = __importStar(require("fs"));
/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to handle College register
 */
const handleCollegeRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collegeName, email, password, contact, location } = req.body;
        const userValidation = joi_1.default.object({
            collegeName: joi_1.default.string().required(),
            email: joi_1.default.string().required(),
            password: joi_1.default.string().required(),
            contact: joi_1.default.number().required(),
            location: joi_1.default.string().required()
        });
        const { error } = userValidation.validate(req.body);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const checkIsUserExists = yield college_model_1.default
            .findOne({
            email
        })
            .select('email -_id');
        if (checkIsUserExists) {
            res.status(axios_1.HttpStatusCode.Conflict).json({
                status: http_message_constant_1.default.CONFLICT,
                code: axios_1.HttpStatusCode.Conflict,
                message: response_message_constant_1.default.USER_ALREADY_EXISTS
            });
        }
        else {
            const encryptedPassword = yield bcryptjs_1.default.hash(password, 10);
            const generatedUserId = (0, uuid_helper_1.generateUUID)();
            yield college_model_1.default.create({
                collegeId: generatedUserId,
                collegeName,
                email,
                isActive: true,
                location,
                contact,
                profilePicture: `https://avatars.dicebear.com/api/initials/${collegeName.replaceAll(' ', '-')}.png`,
                password: encryptedPassword
            });
            const generatedAccessToken = yield (0, jwt_helper_1.signToken)({
                collegeId: generatedUserId,
                email
            });
            res
                .cookie(common_constant_1.default.signatureCookieName, generatedAccessToken, {
                maxAge: 3600000,
                httpOnly: false,
                secure: true,
                sameSite: 'none'
            })
                .status(axios_1.HttpStatusCode.Created)
                .json({
                status: http_message_constant_1.default.CREATED,
                code: axios_1.HttpStatusCode.Created
            });
        }
    }
    catch (err) {
        console.log(error_log_constant_1.default.authController.handleRegisterErrorLog, err.message);
        res
            .status(axios_1.HttpStatusCode.InternalServerError)
            .json({ status: http_message_constant_1.default.ERROR, code: axios_1.HttpStatusCode.InternalServerError });
    }
});
/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to handle user login
 */
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userValidation = joi_1.default.object({
            email: joi_1.default.string().required(),
            password: joi_1.default.string().required()
        });
        const { error } = userValidation.validate(req.body);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const userResponse = yield student_model_1.default.findOne({
            email
        });
        if (!userResponse) {
            const userResponse = yield college_model_1.default.findOne({
                email
            });
            if (!userResponse) {
                return res.status(axios_1.HttpStatusCode.NotFound).json({
                    status: http_message_constant_1.default.NOT_FOUND,
                    code: axios_1.HttpStatusCode.NotFound,
                    message: response_message_constant_1.default.USER_NOT_FOUND
                });
            }
            else {
                const isValidPassword = yield bcryptjs_1.default.compare(password, userResponse.password || '');
                if (isValidPassword) {
                    const { email, collegeName, collegeId } = userResponse;
                    const generatedAccessToken = yield (0, jwt_helper_1.signToken)({
                        collegeId,
                        collegeName,
                        email
                    });
                    res
                        .cookie(common_constant_1.default.signatureCookieName, generatedAccessToken, {
                        maxAge: 3600000,
                        httpOnly: false,
                        secure: true,
                        sameSite: 'none'
                    })
                        .status(axios_1.HttpStatusCode.Ok)
                        .json({
                        status: http_message_constant_1.default.OK,
                        code: axios_1.HttpStatusCode.Ok,
                        data: userResponse
                    });
                }
                else {
                    res.status(axios_1.HttpStatusCode.Unauthorized).json({
                        status: http_message_constant_1.default.UNAUTHORIZED,
                        code: axios_1.HttpStatusCode.Unauthorized,
                        message: response_message_constant_1.default.INVALID_CREDENTIALS
                    });
                }
            }
        }
        else {
            const isValidPassword = yield bcryptjs_1.default.compare(password, userResponse.password || '');
            if (isValidPassword) {
                const { email, name, studentId } = userResponse;
                const generatedAccessToken = yield (0, jwt_helper_1.signToken)({
                    studentId,
                    name,
                    email
                });
                res
                    .cookie(common_constant_1.default.signatureCookieName, generatedAccessToken, {
                    maxAge: 3600000,
                    httpOnly: false,
                    secure: true,
                    sameSite: 'none'
                })
                    .status(axios_1.HttpStatusCode.Ok)
                    .json({
                    status: http_message_constant_1.default.OK,
                    code: axios_1.HttpStatusCode.Ok,
                    data: userResponse
                });
            }
            else {
                res.status(axios_1.HttpStatusCode.Unauthorized).json({
                    status: http_message_constant_1.default.UNAUTHORIZED,
                    code: axios_1.HttpStatusCode.Unauthorized,
                    message: response_message_constant_1.default.INVALID_CREDENTIALS
                });
            }
        }
    }
    catch (err) {
        console.log(error_log_constant_1.default.authController.handleLoginErrorLog, err.message);
        res
            .status(axios_1.HttpStatusCode.InternalServerError)
            .json({ status: http_message_constant_1.default.ERROR, code: axios_1.HttpStatusCode.InternalServerError });
    }
});
/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to handle user logout
 */
const handleLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jwtTokenId = (0, cookie_helper_1.getSkillTrackSignature)(req.headers.cookie);
        yield jwt_token_model_1.default.findOneAndDelete({
            jwtTokenId
        });
        res
            .clearCookie(common_constant_1.default.signatureCookieName, {
            secure: true,
            sameSite: 'none'
        })
            .status(axios_1.HttpStatusCode.Ok)
            .json({
            status: http_message_constant_1.default.OK,
            code: axios_1.HttpStatusCode.Ok
        });
    }
    catch (err) {
        console.log(error_log_constant_1.default.authController.handleLogoutErrorLog, err.message);
        res
            .status(axios_1.HttpStatusCode.InternalServerError)
            .json({ status: http_message_constant_1.default.ERROR, code: axios_1.HttpStatusCode.InternalServerError });
    }
});
/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to handle verifiy session
 */
const handleVerifiySession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.cookie) {
            return res.status(axios_1.HttpStatusCode.Unauthorized).json({
                status: http_message_constant_1.default.UNAUTHORIZED,
                code: axios_1.HttpStatusCode.Unauthorized
            });
        }
        const skillTrackSignature = req.headers.cookie
            .split(';')
            .find((cookie) => cookie.trim().startsWith(common_constant_1.default.signatureCookieName));
        if (!skillTrackSignature) {
            return res.status(axios_1.HttpStatusCode.Unauthorized).json({
                status: http_message_constant_1.default.UNAUTHORIZED,
                code: axios_1.HttpStatusCode.Unauthorized
            });
        }
        else {
            const accessToken = skillTrackSignature.split('=')[1];
            const decodedToken = yield (0, jwt_helper_1.verifyToken)(accessToken);
            if (!decodedToken) {
                return res.status(axios_1.HttpStatusCode.Unauthorized).json({
                    status: http_message_constant_1.default.UNAUTHORIZED,
                    code: axios_1.HttpStatusCode.Unauthorized
                });
            }
            const userResponse = yield student_model_1.default
                .findOne({
                studentId: decodedToken.studentId
            })
                .select('-password -_id -isManualAuth -createdAt -updatedAt -googleId -__v');
            res.status(axios_1.HttpStatusCode.Ok).json({
                status: http_message_constant_1.default.OK,
                code: axios_1.HttpStatusCode.Ok,
                data: userResponse
            });
        }
    }
    catch (err) {
        console.log(error_log_constant_1.default.authController.handleVerifySessionErrorLog, err.message);
        res
            .status(axios_1.HttpStatusCode.InternalServerError)
            .json({ status: http_message_constant_1.default.ERROR, code: axios_1.HttpStatusCode.InternalServerError });
    }
});
/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to handle Student Register
 */
const handleStudentRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collegeId, batchId } = req.body;
        const collegeValidation = joi_1.default.object({
            collegeId: joi_1.default.string().required(),
            batchId: joi_1.default.number().required()
        });
        const { error } = collegeValidation.validate(req.body);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                status: 'BadRequest',
                code: 400,
                message: 'No file uploaded.'
            });
        }
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const records = XLSX.utils.sheet_to_json(sheet);
        for (const row of records) {
            const { email, register_number } = row;
            if (!email || !register_number) {
                console.log('Missing email or register number in row:', row);
                continue;
            }
            const name = email.split('@')[0];
            const password = name;
            const checkIsUserExists = yield student_model_1.default.findOne({ email }).select('email -_id');
            if (checkIsUserExists) {
                console.log(`User already exists: ${email}`);
                continue;
            }
            else {
                const encryptedPassword = yield bcryptjs_1.default.hash(password, 10);
                const generatedStudentId = (0, uuid_helper_1.generateUUID)();
                yield student_model_1.default.create({
                    studentId: generatedStudentId,
                    name,
                    email,
                    register_number,
                    password: encryptedPassword,
                    collegeId: collegeId,
                    batchId: batchId,
                    isUpdated: false
                });
            }
        }
        fs.unlink(file.path, (err) => {
            if (err) {
                console.error('Failed to delete the file:', err);
            }
            else {
                console.log('Uploaded file deleted successfully.');
            }
        });
        res.status(201).json({
            status: 'Created',
            code: 201,
            message: 'Bulk registration completed.'
        });
    }
    catch (err) {
        console.error('Error during bulk registration:', err.message);
        res.status(500).json({
            status: 'InternalServerError',
            code: 500,
            message: 'An error occurred during bulk registration.'
        });
    }
});
exports.default = {
    handleCollegeRegister,
    handleLogin,
    handleVerifiySession,
    handleLogout,
    handleStudentRegister
};
