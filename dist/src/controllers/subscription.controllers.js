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
const http_message_constant_1 = __importDefault(require("../constants/http-message.constant"));
const college_model_1 = __importDefault(require("../models/college.model"));
const updateSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collegeId, batchId, totalNoOfStudents } = req.body;
        const batchValidation = joi_1.default.object({
            collegeId: joi_1.default.string().required(),
            batchId: joi_1.default.string().required(),
            totalNoOfStudents: joi_1.default.number().required()
        });
        const { error } = batchValidation.validate(req.body);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30);
        const subscription = {
            startDate,
            endDate,
            paymentStatus: 'paid'
        };
        const college = yield college_model_1.default.findOne({ collegeId });
        if (!college) {
            return res.status(404).json({
                status: 'Error',
                message: 'College not found'
            });
        }
        const batchIndex = college.batches.findIndex((batch) => batch.batchId === batchId);
        if (batchIndex > -1) {
            college.batches[batchIndex].totalNoOfStudents = totalNoOfStudents;
            college.batches[batchIndex].subscription = subscription;
        }
        else {
            college.batches.push({
                batchId,
                totalNoOfStudents,
                students: [],
                subscription
            });
        }
        yield college.save();
        return res.status(200).json({
            status: 'Success',
            message: 'Subscription updated successfully'
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Error',
            message: 'Failed to update subscription'
        });
    }
});
exports.default = {
    updateSubscription
};
