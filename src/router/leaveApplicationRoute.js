import express from 'express';
import dotenv from 'dotenv';
import leaveApplicationController from '../controllers/leaveApplicationController.js';
import { authentication, checkRole } from '../middleware/JWTAction.js';
dotenv.config();
let router = express.Router();
let initLeaveApplicationRoute = (app) => {
    //leave application
    router.post("", authentication, checkRole('staff', 'manager'), leaveApplicationController.createLeaveApplication);
    router.put("/:id", authentication, checkRole('admin', 'manager'), leaveApplicationController.updateStatusLeaveApplication);
    router.put("/check-in", authentication, checkRole('staff', 'manager'), leaveApplicationController.checkIn);
    router.put("/check-out", authentication, checkRole('staff', 'manager'), leaveApplicationController.checkOut);
    router.get("/time-keeping", authentication, checkRole('admin','manager'), leaveApplicationController.getTimeKeepingInMonth);
    router.get("", authentication, checkRole('admin','manager'), leaveApplicationController.getListLeaveApplication);
    
    return app.use("/api/leave-applications", router);
}
export default initLeaveApplicationRoute;