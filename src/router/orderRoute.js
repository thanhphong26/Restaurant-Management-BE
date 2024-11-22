import express from 'express';
import dotenv from 'dotenv';
import { authentication, checkRole } from '../middleware/JWTAction.js';
import bookingController from '../controllers/bookingController.js';
dotenv.config();
let router = express.Router();
let initOderRoute = (app) => {
    router.get('/:id', bookingController.getOrderById);  //lấy danh sách booking userId hoặc adminId
    router.put('/:id', authentication, checkRole('staff', 'manager'), bookingController.updateOrder);                     // cập nhật thông tin booking theo id
    return app.use("/api/order", router);
}
export default initOderRoute;