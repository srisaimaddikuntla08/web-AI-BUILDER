import express from 'express'
const app = express();

const port = 3000;

app.get('/',(req,res)=>{
    return res.json({message :"server is working!!"})
})





app.listen(port,()=>console.log(`server is running on port :${port}`))