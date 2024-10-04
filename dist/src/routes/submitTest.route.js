"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packages
const express_1 = require("express");
//Importing controller
const submittest_controller_1 = __importDefault(require("../controllers/submittest.controller"));
const resume_comtrollers_1 = __importDefault(require("../controllers/resume.comtrollers"));
// Defining router
const router = (0, express_1.Router)();
// question routes
router.post('/submit/:studentId', submittest_controller_1.default.handlesubmit);
router.put('/update-skill/:studentId', resume_comtrollers_1.default.updateSkills);
exports.default = router;
