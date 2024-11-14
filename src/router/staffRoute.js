import express from 'express';
import dotenv from 'dotenv';
import staffController from '../controllers/staffController.js';
import { authentication, checkRole } from '../middleware/JWTAction.js';
dotenv.config();
let router = express.Router();
let initStaffRoute = (app) => {
   
    router.get("", staffController.getAllStaff);
    router.get("/time-keeping", staffController.getTimeKeepingInMonthByStaffId);
    router.get("/:id", staffController.getStaffById);
    router.post("", authentication, checkRole('admin','manager'), staffController.createStaff);
    router.put("/:id", authentication, checkRole('admin','manager'), staffController.updateStaff);
    router.delete("/:id", authentication, checkRole('admin','manager'), staffController.deleteStaff);

    return app.use("/api/staff", router);
}
export default initStaffRoute;


