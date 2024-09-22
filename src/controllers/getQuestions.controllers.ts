// Importing packges
import { Request, Response } from 'express';
import Joi from 'joi';
import { HttpStatusCode } from 'axios';

// Importing models
import mongoose from 'mongoose';

// Importing constants
import httpStatusConstant from '../constants/http-message.constant';
import responseMessageConstant from '../constants/response-message.constant';


/**
 * @createdBy Kamalesh J
 * @createdAt 2024-09-10
 * @description This function is used to handle get question
 */

export const handleGetQuestions = async (req: Request, res: Response) => {
  try {
    
    const { topic, difficulty} = req.params;
    const verifyParams = Joi.object({
      topic: Joi.string().required(),
      difficulty: Joi.string().required()
    });

    const { error } = verifyParams.validate(req.params);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const questionCollection = mongoose.connection.collection(topic);
   
    // Fetch questions based on difficulty level
    const questions = await questionCollection.find({ difficulty : difficulty }).toArray();
    //No questions found
    if (questions.length === 0) {
        return res.status(404).json({ message: 'No questions found for the specified difficulty level' });
    }
     // Shuffle questions randomly
     const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

    res.status(HttpStatusCode.Created).json({
      status: httpStatusConstant.CREATED,
      code: HttpStatusCode.Created,
      message: responseMessageConstant.QUESTIONS_FETCHED_SUCCESSFULLY,
      data:shuffledQuestions
    });
  } catch (err: any) {
    console.error('Error in handleAddQuestions:', err.message);
    res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError,
      message: responseMessageConstant.INTERNAL_SERVER_ERROR
    });
  }
};

export default{
  handleGetQuestions
}