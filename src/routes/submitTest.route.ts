// Importing packages
import { Router } from 'express';

//Importing controller
import handlesubmitController from '../controllers/submittest.controller';

// Defining router
const router = Router();

// question routes
router.post('/submit/:studentId', handlesubmitController.handlesubmit);

export default router;
