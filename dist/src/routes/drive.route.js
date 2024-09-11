"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packages
const express_1 = require("express");
// Importing controllers
const drive_controllers_1 = __importDefault(require("../controllers/drive.controllers"));
// Defining routers
const router = (0, express_1.Router)();
// Drive routes
router.get('/get-drive/:collegeId', drive_controllers_1.default.getDrives);
router.post('/create-drive/:collegeId', drive_controllers_1.default.createDrive);
router.delete('/delete-drive/:companyId', drive_controllers_1.default.deleteDrive);
router.get('/optin-list/:companyId', drive_controllers_1.default.fetchOptedStudents);
router.get('/optout-list/:companyId', drive_controllers_1.default.fetchOptedOutStudents);
router.put('/optin-drive/:companyId/:studentId', drive_controllers_1.default.handleOptInDrive);
router.put('/optout-drive/:companyId/:studentId', drive_controllers_1.default.handleOptOutDrive);
router.put('/update-placed-students/:companyId/:studentId', drive_controllers_1.default.updatePlacedStudents);
exports.default = router;
