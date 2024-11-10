// Importing packages
import { Router } from 'express';

// Importing controllers
import questionAddController from '../controllers/addQuestion.controller';
import questionGetController from '../controllers/getQuestions.controllers';

// Defining router
const router = Router();

// question routes
router.post('/add', questionAddController.handleAddQuestions);

export default router;