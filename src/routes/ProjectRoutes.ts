import { Router } from "express";
import { ProjectController } from "../controller/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { taskController } from "../controller/TaskController";
import { projectExists } from "../middleware/project";
import { taskExists, tasksBelongsToProject } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { teamMemberController } from "../controller/TeamController";

const router = Router()
router.use(authenticate)

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

router.get('/:id',
    param('id').isMongoId().withMessage('ID not valid'),
    handleInputErrors,
    ProjectController.getAProjectById
)

router.put('/:id',
    param('id').isMongoId().withMessage('ID not valid'),
    body('projectName')
        .notEmpty().withMessage('The Project Name is required'),
    body('clientName')
        .notEmpty().withMessage('The Client Name is required'),
    body('description')
        .notEmpty().withMessage('The Description is required'),
    handleInputErrors,
    ProjectController.updateAProject
)

router.delete('/:id',
    param('id').isMongoId().withMessage('ID not valid'),
    handleInputErrors,
    ProjectController.deleteAProject
)

//Routes Tasks
router.param('projectId', projectExists)

router.post('/:projectId/tasks',
    body('name')
        .notEmpty().withMessage('The Task Name is required'),
    body('description')
        .notEmpty().withMessage('The Description is required'),
    handleInputErrors,
    taskController.createTask
)

router.get('/:projectId/tasks',
    taskController.getProjectTasks
)

router.param('taskId', taskExists)
router.param('taskId', tasksBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID not valid'),
    handleInputErrors,
    taskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID not valid'),
    body('name')
        .notEmpty().withMessage('The Task Name is required'),
    body('description')
        .notEmpty().withMessage('The Description is required'),
    handleInputErrors,
    taskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID not valid'),
    handleInputErrors,
    taskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('ID not valid'),
    body('status')
        .notEmpty().withMessage('The Status is required'),
    handleInputErrors,
    taskController.updateStatus
)

//Routes for teams
router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('Email address not found'),
    handleInputErrors,
    teamMemberController.findMemberByEmail
)

router.get('/:projectId/team',
    teamMemberController.getProjectTeam
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('ID not valid'),
    handleInputErrors,
    teamMemberController.addMemberById
)

router.delete('/:projectId/team',
    body('id')
        .isMongoId().withMessage('ID not valid'),
    handleInputErrors,
    teamMemberController.removeMemberById
)

export default router