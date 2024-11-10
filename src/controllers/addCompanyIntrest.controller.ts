// Importing packges
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';

// Importing model
import driveModel from '../models/drive.model';

// Importing constants
import commonConstant from '../constants/common.constant';
import errorLogConstant from '../constants/error-log.constant';
import httpStatusConstant from '../constants/http-message.constant';
import responseMessageConstant from '../constants/response-message.constant';

/**
 * @createdBy Kamalesh J
 * @createdAt 2024-09-24
 * @description This function is used to handle submit company intrest
 */

const handlesubmitintrest = async (req: Request, res: Response) => {
  try {
    const { studentId, companyId } = req.params;
    const { opted_status } = req.body;
    const findCompany = await driveModel.findOne({ companyId });
    if (findCompany) {
      if (opted_status === 'optin') {
        findCompany.optedStudents.push(studentId);
        // Save the updated document
        await findCompany.save();
      }
      else{
        findCompany.optedOutStudents.push(studentId);
        // Save the updated document
        await findCompany.save();
      }

      res.status(HttpStatusCode.Created).json({
        status: httpStatusConstant.CREATED,
        code: HttpStatusCode.Created,
        message: responseMessageConstant.SUBMITTED_SUCCESSFULLY
      });
    }
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({
      status: HttpStatusCode.InternalServerError,
      code: HttpStatusCode.InternalServerError,
      message: 'Error in submitting test details'
    });
  }
};

export default { handlesubmitintrest };
