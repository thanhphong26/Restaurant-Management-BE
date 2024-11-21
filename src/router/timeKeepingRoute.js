import express from 'express';
import dotenv from 'dotenv';
import leaveApplicationController from '../controllers/leaveApplicationController.js';
import { authentication, checkRole } from '../middleware/JWTAction.js';
dotenv.config();
let router = express.Router();
let initTimeKeepingRoute = (app) => {
    router.put("/check-in/:id", authentication, checkRole('staff', 'manager'), leaveApplicationController.checkIn);
    router.put("/check-out/:id", authentication, checkRole('staff', 'manager'), leaveApplicationController.checkOut);
    router.get("", authentication, checkRole('admin', 'manager'), leaveApplicationController.getTimeKeepingInMonth);
    // router.get("/check-presence", authentication, checkRole('admin','manager'), leaveApplicationController.handleCheckPresence);

    return app.use("/api/time-keepings", router);
}
export default initTimeKeepingRoute;