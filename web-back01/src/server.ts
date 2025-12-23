import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { stripeWebHook } from './controllers/stripeWebHooks';
import { auth } from './lib/auth';
import projectRoute from './routes/projectRoutes';
import userRoute from './routes/userRoutes';
const app = express();

const port = 3000;

const corsOptions = {
    origin: process.env.TRUSTED_ORIGIN?.split(',') || [] ,
    credentials :true,
}

app.use(cors(corsOptions))
app.post('/api/stripe',express.raw({type:'application/json'}),stripeWebHook)
app.use(express.json({limit:"50mb"}))
app.use('/api/user',userRoute)
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use("/api/project",projectRoute)


app.get("/",(req,res)=> res.send("server is on "))

if (process.env.NODE_ENV !== 'production') {
  app.listen(port,()=>console.log(`server is running on port :${port}`))
}

export default app