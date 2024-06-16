import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputError } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { projectExists } from '../middleware/project';
import { hashAuthorization, taskBelongsToProject, taskExists } from '../middleware/task';
import { authenticate } from '../middleware/auth';
import { TeamMemberController } from '../controllers/TeamController';
import Note from '../models/Note';
import { NoteController } from '../controllers/NoteController';
import { hash } from 'bcrypt';

const router = Router();

router.use(authenticate)

//Routes for projects

router.post('/',
    body('projectName')
        .notEmpty().withMessage('Project Name is required'),
    body('teamName')
        .notEmpty().withMessage('Team Name is required'),
    body('description')
        .notEmpty().withMessage('The description is required'),
    handleInputError,       //si pasa la validacion, pasa al controlador  
    ProjectController.createProject
)

router.get('/', ProjectController.getAllProjects); 

router.get('/:id',
    param('id').isMongoId().withMessage('Invalid Project ID'),
    handleInputError,
    ProjectController.getProjectById
)


//Routes for tasks

router.param('projectId', projectExists)

router.put('/:projectId',
    param('projectId').isMongoId().withMessage('Invalid Project ID'),
    body('projectName')
        .notEmpty().withMessage('Project Name is required'),
    body('teamName')
        .notEmpty().withMessage('Team Name is required'),
    body('description')
        .notEmpty().withMessage('The description is required'),
    handleInputError,
    hashAuthorization,
    ProjectController.updateProject
)

router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('Invalid Project ID'),
    handleInputError,
    hashAuthorization,
    ProjectController.deleteProject
)


router.post('/:projectId/tasks',
    hashAuthorization,
    body('taskName')
        .notEmpty().withMessage('Task Name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputError,

    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)


router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid Task ID'),
    handleInputError,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hashAuthorization,
    param('taskId').isMongoId().withMessage('Invalid Task ID'),
    body('taskName')
        .notEmpty().withMessage('Task Name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputError,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hashAuthorization,
    param('taskId').isMongoId().withMessage('Invalid Task ID'),
    handleInputError,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Invalid Task ID'),
    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['PENDING', 'IN_PROGRESS', 'TO_BE_REVIEWED', 'COMPLETED']).withMessage('Invalid status'),
    handleInputError,
    TaskController.updateTaskStatus
)

router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase(). withMessage('Email no válido'),
    handleInputError,
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team',
    TeamMemberController.getProjectTeam
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('Invalid User ID'),
    handleInputError,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('Invalid User ID'),
    handleInputError,
    TeamMemberController.removeMemberById
)

//Routes for notes

router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El contenido de la nota es obligatorio'),
    handleInputError,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('Invalid Note ID'),
    handleInputError,
    NoteController.deleteNote
)

export default router;