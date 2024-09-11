// Importing packages
import { Router } from 'express';

// Importing controllers
import questionGetController from '../controllers/getQuestions.controllers';

// Defining router
const router = Router();

router.get('/get/:topic/:difficulty',questionGetController.handleGetQuestions);

export default router;