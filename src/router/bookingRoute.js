import express from 'express';
import dotenv from 'dotenv';
import bookingController from '../controllers/bookingController.js';
import { authentication, checkRole } from '../middleware/JWTAction.js';
dotenv.config();
let router = express.Router();
let initBookingRoute = (app) => {
    router.get('', authentication, bookingController.getAllBookings);                       //lấy danh sách booking userId hoặc adminId
    router.post('', authentication, checkRole('customer', 'staff'), bookingController.createBooking); //tạo booking cho khách hàng           
    router.post('/comment', authentication, checkRole('customer'), bookingController.createComment);                     //lấy thông tin booking theo id
    router.put('', authentication, bookingController.updateListStaff);                     //lấy thông tin booking theo id
    router.get('/order', authentication, checkRole('staff', 'customer'), bookingController.getOrderDetailByBookingId);                     //lấy thông tin booking theo id

    return app.use("/api/booking", router);
}
export default initBookingRoute;