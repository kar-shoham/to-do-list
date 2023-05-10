import User from '../models/userModel.js'
import createCustomError from '../utils/errorClass.js'
import asyncWrapper from '../middlewares/asyncWrapper.js'
import sendToken from '../utils/sendToken.js'

export let register = asyncWrapper(async(req, res, next) => {
    let {username, email, password} = req.body

    if(!username || !email || !password) {
        return next(createCustomError('Some of the fields are missing', 400))
    }

    let user = await new User({username, email, password})

    await user.save()

    await sendToken(user, res, 'User registered successfully', 201)
})

export let login = asyncWrapper(async(req, res, next) => {
    let {email, password} = req.body

    if(!email || !password) {
        return next(createCustomError('Some of the fields are missing', 400))
    }

    let user = await User.findOne({email}).select('+password')

    if(!user){
        return next(createCustomError('Invalid email or password', 401))
    }

    let isMatched = await user.comparePassword(password)

    if(!isMatched){
        return next(createCustomError('Invalid email or password', 401))
    }

    sendToken(user, res, 'Logged in successfully', 200)
})


export let logout = asyncWrapper(async(req, res, next) => {
    let options = {
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        sameSite: process.env.NODE_ENV === 'development' ? 'lax': 'none',
        secure: process.env.NODE_ENV === 'development' ? false : true
    }
    
    res.status(200).cookie('token', '', options).json({
        success: true,
        message: 'Logged out successfully'
    })
})

export let getAllUsers = asyncWrapper(async(req, res, next) => {
    let users = await User.find({})

    res.json({
        success: true,
        users,
        numUsers: users.length
    })
})