// Importing packges
import { Request, Response } from 'express';
import Joi from 'joi';
import { HttpStatusCode } from 'axios';

// Importing models
import { createDynamicModel } from '../models/questions.model';

// Importing constants
import httpStatusConstant from '../constants/http-message.constant';
import responseMessageConstant from '../constants/response-message.constant';

/**
 * @createdBy Kamalesh J
 * @createdAt 2024-09-10
 * @description This function is used to handle add question
 */

export const handleAddQuestions = async (req: Request, res: Response) => {
  try {
    const { name, questions } = req.body;
    console.log(name,questions)

    // Joi validation schema
    const questionValidation = Joi.object({
      name: Joi.string().required(),
      questions: Joi.array().items(
        Joi.object({
          difficulty: Joi.string().required(),
          question: Joi.string().required(),
          options: Joi.array().items(Joi.string()).min(2).required(),
          answer: Joi.string().required()
        })
      ).required()
    });

    // Validate the request body
    const { error } = questionValidation.validate(req.body);
    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    // Create or use an existing collection based on the `name` provided
    const QuestionModel = createDynamicModel(name);

    // Insert all questions as separate documents into the collection
    const insertedQuestions = await QuestionModel.insertMany(questions);

    res.status(HttpStatusCode.Created).json({
      status: httpStatusConstant.CREATED,
      code: HttpStatusCode.Created,
      message: responseMessageConstant.QUESTIONS_ADDED_SUCCESSFULLY
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
  handleAddQuestions
}