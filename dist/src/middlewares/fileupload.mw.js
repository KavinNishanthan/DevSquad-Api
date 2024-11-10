"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packages
const multer_1 = __importDefault(require("multer"));
/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to upload files
 */
const upload = (0, multer_1.default)({ dest: 'uploads/' });
exports.default = upload;
