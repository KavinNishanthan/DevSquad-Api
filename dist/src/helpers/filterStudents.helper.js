"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterEligibleStudents = void 0;
// Importing models
const drive_model_1 = __importDefault(require("../models/drive.model"));
const resume_model_1 = __importDefault(require("../models/resume.model"));
const filterEligibleStudents = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const drive = yield drive_model_1.default.findOne({ companyId });
        if (!drive) {
            throw new Error('Drive not found');
        }
        const resumes = yield resume_model_1.default.find({
            collegeId: drive.collegeId,
            isPlacementwilling: true,
            batchId: drive.eligibleBatch
        });
        const eligibleStudents = [];
        resumes.forEach((resume) => {
            var _a;
            let isEligible = true;
            const { minTenthMarks, minTwelfthMarks, minCGPA, noHistoryOfArrears, maxArrears } = drive.eligibilityCriteria;
            if (minTenthMarks && resume.education.tenth.percentage < minTenthMarks) {
                isEligible = false;
            }
            if (minTwelfthMarks && resume.education.twelth.percentage < minTwelfthMarks) {
                isEligible = false;
            }
            if (minCGPA && resume.education.college.cgpa < minCGPA) {
                isEligible = false;
            }
            if (noHistoryOfArrears && resume.education.college.history_of_arrears > 0) {
                isEligible = false;
            }
            if (resume.education.college.no_of_current_arrear > maxArrears) {
                isEligible = false;
            }
            if ((_a = drive.techStackEligibility) === null || _a === void 0 ? void 0 : _a.isTechStackRequired) {
                const requiredSkills = drive.techStackEligibility.requiredSkills || [];
                const studentSkills = resume.skills.map((skill) => skill.skill_name);
                const hasAtLeastOneRequiredSkill = requiredSkills.some((skill) => studentSkills.includes(skill));
                if (!hasAtLeastOneRequiredSkill) {
                    isEligible = false;
                }
            }
            if (isEligible) {
                eligibleStudents.push(resume.studentId);
            }
        });
        drive.eligibleStudentsId = eligibleStudents;
        yield drive.save();
    }
    catch (err) {
        console.error('Error filtering eligible students:', err.message);
        throw new Error('Error filtering eligible students');
    }
});
exports.filterEligibleStudents = filterEligibleStudents;
