import express from 'express';
import dotenv from 'dotenv';
import recruitmentController from '../controllers/recruitmentController.js';
import { authentication, checkRole } from '../middleware/JWTAction.js';
dotenv.config();
let router = express.Router();
let initRecruimentRoute = (app) => {

    router.get("", recruitmentController.getAllRecruitment);
    router.get("/:id", recruitmentController.getRecruitmentById);
    router.post("", authentication, checkRole('admin','manager'), recruitmentController.createRecruitment);
    router.put("/:id", authentication, checkRole('admin','manager'), recruitmentController.updateRecruitment);
    router.delete("/:id", authentication, checkRole('admin','manager'), recruitmentController.deleteRecruitment);
    
    return app.use("/api/recruiments", router);
}
export default initRecruimentRoute;