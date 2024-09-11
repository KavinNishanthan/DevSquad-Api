"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packages
const express_1 = require("express");
// Importing routes
const auth_route_1 = __importDefault(require("./auth.route"));
const resume_route_1 = __importDefault(require("./resume.route"));
const drive_route_1 = __importDefault(require("./drive.route"));
const addQuestion_route_1 = __importDefault(require("./addQuestion.route"));
const getQuestion_route_1 = __importDefault(require("./getQuestion.route"));
// Defining router
const router = (0, express_1.Router)();
// Non authorization routes
router.use('/auth', auth_route_1.default);
// authorization routes
router.use('/resume', resume_route_1.default);
router.use('/drive', drive_route_1.default);
router.use('/questions', addQuestion_route_1.default);
router.use('/questions', getQuestion_route_1.default);
exports.default = router;
