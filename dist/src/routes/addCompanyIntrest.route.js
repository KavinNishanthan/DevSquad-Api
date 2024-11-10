"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packages
const express_1 = require("express");
//Importing controller
const addCompanyIntrest_controller_1 = __importDefault(require("../controllers/addCompanyIntrest.controller"));
// Defining router
const router = (0, express_1.Router)();
// question routes
router.post('/opt-status/:studentId/:companyId', addCompanyIntrest_controller_1.default.handlesubmitintrest);
exports.default = router;
