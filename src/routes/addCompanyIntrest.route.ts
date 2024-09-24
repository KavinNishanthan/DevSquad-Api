// Importing packages
import { Router } from 'express';

//Importing controller
import handleintrestController from '../controllers/addCompanyIntrest.controller';

// Defining router
const router = Router();

// question routes
router.post('/add-intrest/:studentId/:companyId', handleintrestController.handlesubmitintrest);

export default router;
