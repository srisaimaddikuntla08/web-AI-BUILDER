import express from 'express'
const app = express();
import 'dotenv/config'
import cors from 'cors'
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import userRoute from './routes/userRoutes';
import projectRoute from './routes/projectRoutes';

const port = 3000;

const corsOptions = {
    origin: process.env.TRUSTED_ORIGIN?.split(',') || [] ,
    credentials :true,
}

app.use(cors(corsOptions))
app.use(express.json({limit:"50mb"}))
app.use('/api/user',userRoute)
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use("/api/project",projectRoute)


app.get("/",(req,res)=> res.send("server is on run"))





app.listen(port,()=>console.log(`server is running on port :${port}`))