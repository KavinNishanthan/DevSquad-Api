// Importing packages
import { Router } from 'express';
// Importing controllers
import addSkillController from '../controllers/addSkills.controller';

// Defining router
const router = Router();

router.post('/add-skills',addSkillController.handleAddNewSkills);
router.get('/get-skills', addSkillController.handleGetAllSkills);

export default router;