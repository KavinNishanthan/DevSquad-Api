// Importing packges
import { Request, Response } from 'express';
import Joi from 'joi';
import { HttpStatusCode } from 'axios';

//Import model
import SkillModel from '../models/addskill.model'
// Importing constants
import httpStatusConstant from '../constants/http-message.constant';
import responseMessageConstant from '../constants/response-message.constant';

/**
 * @createdBy Kamalesh J
 * @createdAt 2024-10-05
 * @description This function is used to handle add skills from admin side
 */

const handleAddNewSkills=async(req:Request,res:Response)=>{
    try {
        const {skill_name}=req.body
        if (typeof skill_name !== 'string') {
            return res.status(HttpStatusCode.BadRequest).json({
                status: httpStatusConstant.ERROR,
                code: HttpStatusCode.BadRequest,
                message: 'Invalid skill_name format. Expected a string.'
            });
        }
        const newSkillsDocument = new SkillModel({
            skill_name:skill_name
        });

        await newSkillsDocument.save();
        res.status(HttpStatusCode.Created).json({
            status: httpStatusConstant.CREATED,
            code: HttpStatusCode.Created
          });
    } catch (error:any) {
        console.log(error)
        return res.status(HttpStatusCode.InternalServerError).json({
            status: httpStatusConstant.ERROR,
            code: HttpStatusCode.InternalServerError
          });
    }
}

export default{
    handleAddNewSkills
}