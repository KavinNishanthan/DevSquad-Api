// Importing packages
import { Router } from 'express';

// Importing controllers
import driveController from '../controllers/drive.controllers.';

// Defining routers
const router = Router();

// Drive routes
router.get('/get-drive/:collegeId', driveController.getDrives);
router.post('/create-drive/:collegeId', driveController.createDrive);
router.delete('/delete-drive/:companyId', driveController.deleteDrive);

export default router;
