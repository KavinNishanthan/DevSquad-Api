// Importing packages
import { Router } from 'express';

// Importing controllers
import driveController from '../controllers/drive.controllers';

// Defining routers
const router = Router();

// Drive routes
router.get('/get-drive/:collegeId', driveController.getDrives);
router.post('/create-drive/:collegeId', driveController.createDrive);
router.delete('/delete-drive/:companyId', driveController.deleteDrive);
router.get('/optin-list/:companyId', driveController.fetchOptedStudents);
router.get('/optout-list/:companyId', driveController.fetchOptedOutStudents);
router.put('/optin-drive/:companyId/:studentId', driveController.handleOptInDrive);
router.put('/optout-drive/:companyId/:studentId', driveController.handleOptOutDrive);
router.put('/update-placed-students/:companyId/:studentId', driveController.updatePlacedStudents);


export default router;
