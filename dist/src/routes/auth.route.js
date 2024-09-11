"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packages
const express_1 = require("express");
// Importing controllers
const auth_controllers_1 = __importDefault(require("../controllers/auth.controllers"));
const fileupload_mw_1 = __importDefault(require("./../middlewares/fileupload.mw"));
// Defining routers
const router = (0, express_1.Router)();
// Manual auth routes
router.post('/login', auth_controllers_1.default.handleLogin);
router.post('/college-register', auth_controllers_1.default.handleCollegeRegister);
router.post('/student-register', fileupload_mw_1.default.single('file'), auth_controllers_1.default.handleStudentRegister);
exports.default = router;
