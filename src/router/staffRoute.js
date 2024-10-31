import express from 'express';
import dotenv from 'dotenv';
import staffController from '../controllers/staffController.js';
dotenv.config();
let router = express.Router();
let initStaffRoute = (app) => {
    //staff
    router.get("", staffController.getAllStaff);
    router.get("/position/:position", staffController.getStaffByPosition);
    router.get("/type/:type", staffController.getStaffByType);
    return app.use("/api/staff", router);
}
export default initStaffRoute;