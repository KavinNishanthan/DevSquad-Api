"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packages
const express_1 = require("express");
// Importing controllers
const addQuestion_controller_1 = __importDefault(require("../controllers/addQuestion.controller"));
// Defining router
const router = (0, express_1.Router)();
// question routes
router.post('/add', addQuestion_controller_1.default.handleAddQuestions);
exports.default = router;
