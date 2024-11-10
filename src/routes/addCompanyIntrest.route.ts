// Importing packages
import { Router } from 'express';

//Importing controller
import handleintrestController from '../controllers/addCompanyIntrest.controller';

// Defining router
const router = Router();

// question routes
router.post('/opt-status/:studentId/:companyId', handleintrestController.handlesubmitintrest);

export default router;
