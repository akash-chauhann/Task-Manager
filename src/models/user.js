import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import {Task} from "../models/task.js"

const userSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens:[{
        token : {
            type:String,
            required:true
        }
    }]
});

userSchema.virtual('tasks',
{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function() // this is to hide the private data of a user
{
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}
userSchema.methods.generateAuthToken = async function() //methods can be called on instances.
{
    const user = this;
    const token = jwt.sign({_id: user._id.toString()},'thisisnodecourse');
    user.tokens=user.tokens.concat({token})
    await user.save();
    return token
}
userSchema.statics.findByCredentials=async(email,password)=>{ //statics functions can be called on models.
    const user = await User.findOne({email})
    if(!user)
    {
        throw new Error('Unable to login');
    }
    const passMatch = await bcryptjs.compare(password,user.password)
    if(!passMatch)
    {
        throw new Error('Unable to login');
    }
    return user;
}

//hash the plain text password before saving
userSchema.pre('save',async function(next){
    const user=this;
    if(user.isModified('password'))
    {
        user.password=await bcryptjs.hash(user.password,8)
    }
    next();
});

userSchema.pre('deleteOne',{ document: true },async function(next){
    const user=this;
    await Task.deleteMany({owner: user._id})
    next();
})
export const User = mongoose.model('User',userSchema);