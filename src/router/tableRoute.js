import express from 'express';
import dotenv from 'dotenv';
import { authentication, checkRole } from '../middleware/JWTAction.js';
import tableController from '../controllers/tableController.js';
dotenv.config();
let router = express.Router();
let initTableRoute = (app) => {
    router.post('', authentication, checkRole('manager'), tableController.createTable); //tạo booking cho khách hàng           
    router.put('', authentication, checkRole('staff'), tableController.updateTable);                       //lấy danh sách booking userId hoặc adminId
    router.get('', authentication, checkRole('staff'), tableController.getAllTable);
    return app.use("/api/table", router);
}
export default initTableRoute;