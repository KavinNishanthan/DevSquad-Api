// Importing packages
import { Router } from 'express';

// Importing routes
import authRoute from './auth.route';
import resumeRoute from './resume.route';

// Defining router
const router = Router();

// Non authorization routes
router.use('/auth', authRoute);

// authorization routes
router.use('/resume', resumeRoute);

export default router;
