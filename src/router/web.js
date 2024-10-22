import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import staffController from '../controllers/staffController.js';

let router = express.Router();
let initWebRount = (app) => {
    //router.all("*", checkTokenWithCookie, checkAuthentication)

    //staff
    router.get("/staff", staffController.getAllStaff);
    router.get("/staff/position/:position", staffController.getStaffByPosition);
    router.get("/staff/type/:type", staffController.getStaffByType);

    return app.use("/api/", router);
}
export default initWebRount;