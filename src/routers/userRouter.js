import  express  from "express";
import {User} from "../models/user.js";
import {auth} from "../middlewear/auth.js"

export const userRouter=new express.Router();
userRouter.post('/users',async(req,res)=>{
    const user=new User(req.body);
    try{
    await user.save();
    await user.generateAuthToken();
    res.status(201).send({user});
    }
    catch(err)
    {
        console.log('Error : ', err);
        res.status(400).send(err);
    }
})

userRouter.post('/users/login', async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.send({user,token});
    }
    catch(err)
    {
        res.status(400).send(err);
    }
})

userRouter.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        })
        await req.user.save();
        res.send();
    }
    catch(err)
    {
        res.send(err);
    }
})

userRouter.post('/users/logoutall',auth,async(req,res)=>{
    try{
        req.user.tokens=[];
        await req.user.save();
        res.send();
    }
    catch(err)
    {
        res.status(500).send(err);
    }
})

userRouter.get('/users/me',auth, async(req,res)=>{
    try{
        res.send(req.user);
    }
    catch(err)
    {
    }
})

userRouter.get('/users/:id',auth,async (req,res)=>{
    const _id=req.params.id;
    try{
        const user = await User.findById(_id);
        if(!user)
        {
            return res.status(404).send();
        }
        res.send(user);
    }
    catch(err)
    {
        res.status(500).send(err);
    }
});

userRouter.patch('/users/:id',async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOption=updates.every((update)=> allowedUpdates.includes(update))
    if(!isValidOption)
        {
            return res.status(400).send({"Error": "Invalid updates"})
        }
    try{
        const user = await User.findById(req.params.id);
        updates.forEach((update)=>{
            user[update]=req.body[update];
        })
        await user.save();
        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if(!user)
        {
            return res.status(404).send();
        }
        res.send(user);
    }
    catch(err)
    {
        res.status(400).send(err);
    }
    })

userRouter.delete('/users/:id',async(req,res)=>{
    try{
        const user=await User.findByIdAndDelete(req.params.id)
        if(!user)
        {
            return res.status(404).send();
        }
        res.send(user);
    }
    catch(err)
    {
        res.status(500).send();
    }
})