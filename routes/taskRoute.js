import express from 'express'
import { completionFlip, createTask, deleteTask, getAllTask, getTask, updateTask } from '../controllers/taskController.js'
import {isAuthenticated, authorizeRole} from '../middlewares/auth.js'

let router = express.Router()

router.route('/task').post(isAuthenticated, createTask)
router.route('/task/:id')
    .delete(isAuthenticated, deleteTask)
    .patch(isAuthenticated, updateTask)
    .get(isAuthenticated, getTask)

router.route('/task/flip/:id').patch(isAuthenticated, completionFlip)
router.route('/tasks').get(isAuthenticated, getAllTask)

export default router