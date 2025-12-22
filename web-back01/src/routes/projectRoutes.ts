import express from 'express'
import { protect } from '../middleware/auth';
import { deleteProject, getProjectById, getProjectPreview, getPublishedProjects, makeRevision, rollbackToVersion, saveProjectCode } from '../controllers/projectController';
const projectRoute = express.Router();

projectRoute.post("/revision/:projectId",protect,makeRevision)
projectRoute.put("/save/:projectId",protect,saveProjectCode)
projectRoute.get("/rollback/:projectId",protect,rollbackToVersion),
projectRoute.delete("/:projectId",protect,deleteProject);
projectRoute.get("/preview/:projectId",protect,getProjectPreview);
projectRoute.get("/publish",getPublishedProjects);
projectRoute.get("/published/:projectId",protect,getProjectById)

export default projectRoute;
