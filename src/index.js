import express from 'express';
import {} from "./db/mongoose.js";
import {userRouter} from "./routers/userRouter.js"
import { taskRouter } from './routers/taskRouter.js';

const app=express();
const port= process.env.PORT || 3000;

app.use(express.json()); // this is used to convert the result of API call to json object
app.use(userRouter);
app.use(taskRouter);
app.listen(port,()=>{
    console.log('The port value : ' + port)
});