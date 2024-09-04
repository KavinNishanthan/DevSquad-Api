// Importing packages
import { Router } from 'express';

// Importing controllers
import resumeController from '../controllers/resume.comtrollers';

// Defining routers
const router = Router();

// Reesume routes
router.post('/create-resume/:studentId', resumeController.createResume);
router.put('/update-resume/:studentId', resumeController.updateResume);

export default router;
