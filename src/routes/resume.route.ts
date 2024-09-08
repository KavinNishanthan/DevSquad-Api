// Importing packages
import { Router } from 'express';

// Importing controllers
import resumeController from '../controllers/resume.comtrollers';

// Defining routers
const router = Router();

// Resume routes
router.post('/create-resume/:studentId', resumeController.createResume);
router.put('/update-resume/:studentId', resumeController.updateResume);
router.post('/add-skill/:studentId', resumeController.addSkills);
router.post('/add-project/:studentId', resumeController.addProject);
router.delete('/delete-project/:studentId/:projectId', resumeController.deleteProject);
router.post('/add-experience/:studentId', resumeController.addExperience);
router.delete('/delete-experience/:studentId/:experienceId', resumeController.deleteExperience);
router.post('/add-interest/:studentId', resumeController.addAreaOfInterest);
router.patch('/delete-interest/:studentId/', resumeController.deleteAreaOfInterest);

export default router;
