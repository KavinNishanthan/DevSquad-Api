// Importing packages
import { Router } from 'express';

//Importing controller
import handlesubmitController from '../controllers/submittest.controller';
import resumeController from '../controllers/resume.comtrollers';
// Defining router
const router = Router();

// question routes
router.post('/submit/:studentId', handlesubmitController.handlesubmit);
router.put('/update-skill/:studentId', resumeController.updateSkills);

export default router;
