import express from 'express'
import { getAllUsers, getMyDetails, login, logout, register } from '../controllers/userController.js'
import {isAuthenticated, authorizeRole} from '../middlewares/auth.js'

let router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/me').get(isAuthenticated, getMyDetails)

router.route('/getallusers').get(isAuthenticated, authorizeRole('admin'), getAllUsers)

export default router