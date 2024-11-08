import express from 'express';
import dotenv from 'dotenv';
import applicationController from '../controllers/applicationController.js';
import { authentication, checkRole } from '../middleware/JWTAction.js';
dotenv.config();
let router = express.Router();
let initApplicationRoute = (app) => {
    
    router.get("", authentication, checkRole('admin','manager'), applicationController.getAllApplicationsByStatus);
    router.get("/:id", authentication, checkRole('admin','manager'), applicationController.getApplicationById);
    router.post("", applicationController.createApplication);
    router.put("/:id", authentication, checkRole('admin','manager'),  applicationController.updateApplication);
    router.delete("/:id", applicationController.deleteApplication);
    
    return app.use("/api/application", router);
}
export default initApplicationRoute;


