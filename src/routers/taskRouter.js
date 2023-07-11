import { Task } from "../models/task.js";
import express from "express"

export const taskRouter=new express.Router();
taskRouter.post('/task',async(req,res)=>{
    try{
        const task=new Task(req.body);
        await task.save();
        res.send(task);
    }
    catch(err)
    {
        res.status(400).send();
    }
})

taskRouter.get('/tasks',async(req,res)=>{
    try{
        const tasks= await Task.find({});
        res.send(tasks);
    }
    catch(err)
    {
        res.status(500).send();
    }
})

taskRouter.get('/tasks/:id',async(req,res)=>{
    try{
        const _id=req.params.id;
        const task= await Task.findById(_id);
        if(!task)
        {
            return res.status(404).send();
        }
        res.send(task);
    }
    catch(err)
    {
        res.status(500).send();
    }
})

taskRouter.patch('/tasks/:id',async(req,res)=>{
    const updates=Object.keys(req.body);
    const allowedUpdates=['description','completed'];
    const isValidOption=updates.every((update)=>allowedUpdates.includes(update));
    if(!isValidOption)
    {
        return res.status(400).send({Error:"Invalid Updates"});
    }
    try{
        //const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        const task=await Task.findById(req.params.id);
        updates.forEach((update)=>{
            task[update]=req.body[update];
        })
        await task.save();
        if(!task)
        {
            res.status(404).send()
        }
        res.send(task);
    }
    catch(err)
    {
        res.status(400).send(err);
    }
}
);

taskRouter.delete('/tasks/:id',async(req,res)=>{
    try{
        const task=await Task.findByIdAndDelete(req.params.id);
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
