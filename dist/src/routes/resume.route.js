"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packages
const express_1 = require("express");
// Importing controllers
const resume_comtrollers_1 = __importDefault(require("../controllers/resume.comtrollers"));
// Defining routers
const router = (0, express_1.Router)();
// Resume routes
router.post('/add-skill/:studentId', resume_comtrollers_1.default.addSkills);
router.get('/get-resume/:studentId', resume_comtrollers_1.default.getResume);
router.post('/add-project/:studentId', resume_comtrollers_1.default.addProject);
router.put('/update-resume/:studentId', resume_comtrollers_1.default.updateResume);
router.post('/add-experience/:studentId', resume_comtrollers_1.default.addExperience);
router.post('/add-interest/:studentId', resume_comtrollers_1.default.addAreaOfInterest);
router.post('/create-resume/:collegeId/:studentId', resume_comtrollers_1.default.createResume);
router.patch('/delete-interest/:studentId', resume_comtrollers_1.default.deleteAreaOfInterest);
router.delete('/delete-project/:studentId/:projectId', resume_comtrollers_1.default.deleteProject);
router.delete('/delete-experience/:studentId/:experienceId', resume_comtrollers_1.default.deleteExperience);
exports.default = router;
