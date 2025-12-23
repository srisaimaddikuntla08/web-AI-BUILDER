import express from 'express';
import { createUserProject, getAllCredits, getUserproject, getUserProjects, purchaseCredits, togglePublish } from '../controllers/userController';
import { protect } from '../middleware/auth';

const userRoute = express.Router();

userRoute.get("/credits",protect, getAllCredits);
userRoute.post("/project",protect,createUserProject)
userRoute.get("/project/:projectId",protect,getUserproject);
userRoute.get("/projects",protect,getUserProjects)
userRoute.get("/publish-toggle/:projectId",protect,togglePublish),
userRoute.post("/purchase-credits",protect,purchaseCredits);


export default userRoute;
