import mongoose from "mongoose"

let taskSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User id is compulsory']
    },
    task: {
        type: String,
        required: [true, 'Task must have a name']
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
})
export default mongoose.model('Task', taskSchema)