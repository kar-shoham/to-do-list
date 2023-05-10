import mongoose from "mongoose"
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is compulsory']
    },
    email: {
        type: String,
        required: [true, 'Email is compulsory'],
        unique: true,
        validate: validator.isEmail
    },
    password: {
        type: String,
        required: [true, 'Password is compulsory'],
        minLength: [8, 'Password must be longer'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.getJWT = function(){
    let options = {
        expiresIn: '15d'
    }
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, options)
}


userSchema.methods.comparePassword = function(pass){
    return bcrypt.compare(pass, this.password)
}


export default mongoose.model('User', userSchema)