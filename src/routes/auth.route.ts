// Importing packages
import { Router } from 'express';

// Importing controllers
import authController from '../controllers/auth.controllers';

import upload from './../middlewares/fileupload.mw';

// Defining routers
const router = Router();

// Manual auth routes
router.post('/login', authController.handleLogin);
router.post('/college-register', authController.handleCollegeRegister);
router.post('/student-register', upload.single('file'), authController.handleStudentRegister);

export default router;
