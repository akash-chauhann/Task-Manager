import jwt from "jsonwebtoken"
import {User} from "../models/user.js"
export const auth= async(req,res,next)=>{
   try {
        const token=req.header('Authorization').replace('Bearer ','');
        const decoded= jwt.verify(token,'thisisnodecourse')
        const user= await User.findOne({_id: decoded._id,'tokens.token': token})
        if(!user)
        {
            throw new Error();
        }
        req.user = user;
        next();
   }
   catch(err)
   {
    res.status(401).send({Error:`Please authenticat : ${err}`})
   }
}