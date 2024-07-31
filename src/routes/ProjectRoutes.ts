import { Router } from "express";
import { ProjectController } from "../controller/ProjectController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.post('/',
    body('projectName')
        .notEmpty().withMessage('The Project Name is required'),
    body('clientName')
        .notEmpty().withMessage('The Client Name is required'),
    body('description')
        .notEmpty().withMessage('The Description is required'),
    handleInputErrors,
    ProjectController.createProject
)

router.get('/', ProjectController.getAllProjects)

export default router