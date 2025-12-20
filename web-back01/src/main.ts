import express from 'express'
const app = express();
import 'dotenv/config'
import cors from 'cors'

import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';


const port = 3000;


const corsOptions = {
    origin: process.env.TRUSTED_ORIGIN?.split(',') || [] ,
    credentials :true,
}

app.use(cors(corsOptions))
app.all('/api/auth/{*any}', toNodeHandler(auth));




app.get('/',(req,res)=>{
    return res.json({message :"working of server"})
})







app.listen(port,()=>console.log(`server is running on port :${port}`))