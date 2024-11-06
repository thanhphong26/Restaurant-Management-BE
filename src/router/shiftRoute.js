import express from 'express';
import dotenv from 'dotenv';
import shiftController from '../controllers/shiftController.js';    
import { authentication, checkRole } from '../middleware/JWTAction.js';

dotenv.config();
let router = express.Router();
let initShiftRoute = (app) => {
    
    router.get("", authentication, shiftController.getAllShifts);
    router.get("/:id", authentication, shiftController.getShiftsByStaffId);
    router.get("/by-date", authentication, shiftController.getShiftsByDateRange);
    router.post("", authentication, checkRole('admin','manager'), shiftController.createShift);
    router.put("/:id", authentication, checkRole('admin','manager'), shiftController.updateShift);
    
    return app.use("/api/shift", router);
}
export default initShiftRoute;