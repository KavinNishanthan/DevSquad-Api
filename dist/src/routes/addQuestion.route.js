"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packages
const express_1 = require("express");
// Importing controllers
const addQuestion_controller_1 = __importDefault(require("../controllers/addQuestion.controller"));
const getQuestions_controllers_1 = __importDefault(require("../controllers/getQuestions.controllers"));
// Defining router
const router = (0, express_1.Router)();
// question routes
router.post('/add', addQuestion_controller_1.default.handleAddQuestions);
router.get('/get-questions/:topic/:difficulty', getQuestions_controllers_1.default.handleGetQuestions);
exports.default = router;
