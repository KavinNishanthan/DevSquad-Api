// Importing packges
import Joi from 'joi';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';

// Importing models
import resumeModel from '../models/resume.model';

// Importing constants
import errorLogConstant from '../constants/error-log.constant';
import httpStatusConstant from '../constants/http-message.constant';
import responseMessageConstant from '../constants/response-message.constant';
import collegeModel from '../models/college.model';

const updateSubscription = async (req: Request, res: Response) => {
  try {
    const { collegeId, batchId, totalNoOfStudents } = req.body;

    const batchValidation = Joi.object({
      collegeId: Joi.string().required(),
      batchId: Joi.string().required(),
      totalNoOfStudents: Joi.number().required()
    });

    const { error } = batchValidation.validate(req.body);
    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);

    const subscription = {
      startDate,
      endDate,
      paymentStatus: 'paid' as 'paid'
    };

    const college = await collegeModel.findOne({ collegeId });

    if (!college) {
      return res.status(404).json({
        status: 'Error',
        message: 'College not found'
      });
    }

    const batchIndex = college.batches.findIndex((batch: any) => batch.batchId === batchId);

    if (batchIndex > -1) {
      college.batches[batchIndex].totalNoOfStudents = totalNoOfStudents;
      college.batches[batchIndex].subscription = subscription;
    } else {
      college.batches.push({
        batchId,
        totalNoOfStudents,
        students: [],
        subscription
      });
    }

    await college.save();

    return res.status(200).json({
      status: 'Success',
      message: 'Subscription updated successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Error',
      message: 'Failed to update subscription'
    });
  }
};

export default {
  updateSubscription
};
