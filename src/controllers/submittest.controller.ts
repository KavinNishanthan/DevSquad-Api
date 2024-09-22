// Importing packges
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';

// Importing model
import resumeModel from '../models/resume.model';

// Importing constants
import commonConstant from '../constants/common.constant';
import errorLogConstant from '../constants/error-log.constant';
import httpStatusConstant from '../constants/http-message.constant';
import responseMessageConstant from '../constants/response-message.constant';


/**
 * @createdBy Kamalesh J
 * @createdAt 2024-09-15
 * @description This function is used to handle submit test
 */

const handlesubmit=async(req:Request,res:Response)=>{
    try {
        const { studentId } = req.params;
        const {skill_name,test_result,level}=req.body;
        const findStudent = await resumeModel.findOne({ studentId });
        if(findStudent){
        
        findStudent.skills.push({ skill_name, test_result, level });
        // Save the updated document
        await findStudent.save();
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
}

export default{handlesubmit};