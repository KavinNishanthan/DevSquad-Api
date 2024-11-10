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
exports.verifyToken = exports.signToken = void 0;
// Importing packages
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Importing helpers
const uuid_helper_1 = require("./uuid.helper");
// Importing models
const jwt_token_model_1 = __importDefault(require("../models/jwt-token.model"));
/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to sign jwt token
 */
const signToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const generatedToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_KEY || '');
        const token = yield jwt_token_model_1.default.create({ jwtTokenId: (0, uuid_helper_1.generateUUID)(), token: generatedToken });
        return token.jwtTokenId;
    }
    catch (err) {
        return err.message;
    }
});
exports.signToken = signToken;
/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to verify jwt token
 */
const verifyToken = (jwtTokenId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = null;
        const tokenResponse = yield jwt_token_model_1.default.findOne({ jwtTokenId });
        if (tokenResponse) {
            token = tokenResponse.token;
        }
        else {
            token = null;
        }
        return jsonwebtoken_1.default.verify(token, process.env.JWT_KEY || '');
    }
    catch (err) {
        return null;
    }
});
exports.verifyToken = verifyToken;
