import { Task } from "../models/task.js";
import express from "express"
import {auth} from "../middlewear/auth.js"

export const taskRouter=new express.Router();
taskRouter.post('/task',auth,async(req,res)=>{
    try{
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save();
        res.send(task);
    }
    catch(err)
    {
        res.status(400).send();
    }
})

taskRouter.get('/tasks',auth,async(req,res)=>{
    try{
        //const tasks= await Task.find({owner:req.user._id});
        await req.user.populate('tasks');
        res.send(req.user.tasks);
    }
    catch(err)
    {
        res.status(500).send();
    }
})

taskRouter.get('/tasks/:id',auth,async(req,res)=>{
    try{
        const _id=req.params.id;
        const task= await Task.findOne({ _id,owner: req.user._id})
        if(!task)
        {
            return res.status(404).send({Error:"Can't find the Task"});
        }
        res.send(task);
    }
    catch(err)
    {
        res.status(500).send();
    }
})

taskRouter.patch('/tasks/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body);
    const allowedUpdates=['description','completed'];
    const isValidOption=updates.every((update)=>allowedUpdates.includes(update));
    if(!isValidOption)
    {
        return res.status(400).send({Error:"Invalid Updates"});
    }
    try{
        //const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task)
        {
            res.status(404).send()
        }
        updates.forEach((update)=>{
            task[update]=req.body[update];
        })
        await task.save();
        res.send(task);
    }
    catch(err)
    {
        res.status(400).send(err);
    }
}
);

taskRouter.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task=await Task.findOneAndDelete({_id:req.params.id, owner:req.user.id})
        if(!task)
        {
            res.status(404).send({error: 'User Not Found'});
        }
        res.send(task);
    }
    catch(err)
    {
        res.status(500).send(err);
    }
})
