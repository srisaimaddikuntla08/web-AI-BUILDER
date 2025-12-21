import express from 'express';
import  {protect} from '../middleware/auth'

const userRoute = express.Router();

userRoute.get("/purchase-credits",protect,() => {});


export default userRoute;
