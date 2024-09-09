// Importing packges
import Joi, { string } from 'joi';
import bcrypt from 'bcryptjs';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { generateUUID } from '../helpers/uuid.helper';

// Importing models
import driveModel from '../models/drive.model';
import resumeModel from '../models/resume.model';

// Importing constants
import commonConstant from '../constants/common.constant';
import errorLogConstant from '../constants/error-log.constant';
import httpStatusConstant from '../constants/http-message.constant';
import responseMessageConstant from '../constants/response-message.constant';

export const filterEligibleStudents = async (companyId: string) => {
  try {
    const drive = await driveModel.findOne({ companyId });

    if (!drive) {
      throw new Error('Drive not found');
    }

    const resumes = await resumeModel.find({
      collegeId: drive.collegeId,
      isPlacementwilling: true,
      batchId: drive.eligibleBatch
    });

    const eligibleStudents: string[] = [];

    resumes.forEach((resume) => {
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

      if (drive.techStackEligibility?.isTechStackRequired) {
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
    await drive.save();
  } catch (err: any) {
    console.error('Error filtering eligible students:', err.message);
    throw new Error('Error filtering eligible students');
  }
};
  