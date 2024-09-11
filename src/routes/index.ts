// Importing packages
import { Router } from 'express';

// Importing routes
import authRoute from './auth.route';
import resumeRoute from './resume.route';
import driveRoute from './drive.route';
import addQuestion from './addQuestion.route';
import getQuestion from './getQuestion.route'
// Defining router
const router = Router();

// Non authorization routes
router.use('/auth', authRoute);

// authorization routes
router.use('/resume', resumeRoute);
router.use('/drive', driveRoute);
router.use('/questions',addQuestion);
router.use('/questions',getQuestion);

export default router;
