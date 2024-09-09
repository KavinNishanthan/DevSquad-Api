// Importing packages
import { Router } from 'express';

// Importing controllers
import resumeController from '../controllers/resume.comtrollers';

// Defining routers
const router = Router();

// Resume routes
router.post('/add-skill/:studentId', resumeController.addSkills);
router.get('/get-resume/:studentId', resumeController.getResume);
router.post('/add-project/:studentId', resumeController.addProject);
router.put('/update-resume/:studentId', resumeController.updateResume);
router.post('/add-experience/:studentId', resumeController.addExperience);
router.post('/add-interest/:studentId', resumeController.addAreaOfInterest);
router.post('/create-resume/:collegeId/:studentId/', resumeController.createResume);
router.patch('/delete-interest/:studentId/', resumeController.deleteAreaOfInterest);
router.delete('/delete-project/:studentId/:projectId', resumeController.deleteProject);
router.delete('/delete-experience/:studentId/:experienceId', resumeController.deleteExperience);

export default router;
