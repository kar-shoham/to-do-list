import asyncWrapper from "./asyncWrapper.js";
import createCustomError from '../utils/errorClass.js'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

let isAuthenticated = asyncWrapper(async(req, res, next) => {
    let {token} = req.cookies

    if(!token){
        return next(createCustomError('Login in first to access this resource', 403))
    }

    let {id} = jwt.verify(token, process.env.JWT_SECRET)

    let user = await User.findById(id)

    if(!user){
        return next(createCustomError('Authentication error', 403))
    }

    req.user = user

    next()
})


let authorizeRole = (...roles) => {
    return async(req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(createCustomError('You dont have the permissions to access this resource', 403))
        }
        next()
    }
}

export {isAuthenticated, authorizeRole}