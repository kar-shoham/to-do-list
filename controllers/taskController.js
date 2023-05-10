import asyncWrapper from '../middlewares/asyncWrapper.js'
import createCustomError from '../utils/errorClass.js'
import Task from '../models/taskModel.js'

export let createTask = asyncWrapper(async(req, res, next) => {
    let {task} = req.body

    if(!task){
        return next(createCustomError('Please enter a task name', 400))
    }
    
    let tsk = await new Task({
        task,
        user_id: req.user._id
    })

    await tsk.save()

    res.status(201).json({
        success: true,
        message: 'Task created successfully',
        task: tsk.task
    })
})


export let getTask = asyncWrapper(async(req, res, next) => {
    let {id} = req.params
    
    let task = await Task.findById(id).select('-_id -__v')

    if(!task){
        return next(createCustomError('Task not found', 404))
    }

    let isMatched = req.user._id.equals(task.user_id)

    if(!isMatched){
        return next(createCustomError("You don't have the permissions to access this resource", 403))
    }

    res.status(200).json({
        success: true,
        task
    })
})

export let getAllTask = asyncWrapper(async(req, res, next) => {
    let id = req.user._id

    let tasks = await Task.find({user_id: id}).select('-user_id -__v')

    res.status(200).json({
        success: true,
        tasks,
        numTasks: tasks.length
    })
})

export let deleteTask = asyncWrapper(async(req, res, next) => {
    let {id} = req.params
    
    let task = await Task.findById(id)

    if(!task){
        return next(createCustomError('Task not found', 404))
    }

    let isMatched = req.user._id.equals(task.user_id)

    if(!isMatched){
        return next(createCustomError("You don't have the permissions to access this resource", 403))
    }

    await Task.findByIdAndRemove(id)

    console.log('Lulz')
    res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
    })
})

export let updateTask = asyncWrapper(async(req, res, next) => {
    let {id} = req.params
    
    let tsk = await Task.findById(id).select('-__v')

    if(!tsk){
        return next(createCustomError('Task not found', 404))
    }

    let isMatched = req.user._id.equals(tsk.user_id)

    if(!isMatched){
        return next(createCustomError("You don't have the permissions to access this resource", 403))
    }

    let {task, isCompleted} = req.body
    
    if(!task && !isCompleted){
        return next(createCustomError('Nothing to update', 400))
    }
    
    if(task) tsk.task = task

    if(isCompleted) tsk.isCompleted = isCompleted

    await tsk.save()

    res.status(200).json({
        success: true,
        message: 'Task Updated Successfully',
        task: tsk
    })
})

export let completionFlip = asyncWrapper(async(req, res, next) => {
    let {id} = req.params
    
    let task = await Task.findById(id).select('-__v')

    if(!task){
        return next(createCustomError('Task not found', 404))
    }

    let isMatched = req.user._id.equals(task.user_id)

    if(!isMatched){
        return next(createCustomError("You don't have the permissions to access this resource", 403))
    }

    task.isCompleted = !task.isCompleted
    await task.save()

    res.status(200).json({
        success: true,
        message: 'Task Updated Successfully',
        task
    })
})