"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packages
const express_1 = require("express");
// Importing controllers
const addSkills_controller_1 = __importDefault(require("../controllers/addSkills.controller"));
// Defining router
const router = (0, express_1.Router)();
router.post('/add-skills', addSkills_controller_1.default.handleAddNewSkills);
router.get('/get-skills', addSkills_controller_1.default.handleGetAllSkills);
exports.default = router;
