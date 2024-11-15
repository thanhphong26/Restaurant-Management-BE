import express from 'express';
import dotenv from 'dotenv';
import bookingController from '../controllers/bookingController.js';
import { authentication, checkRole } from '../middleware/JWTAction.js';
dotenv.config();
let router = express.Router();
let initBookingRoute = (app) => {
    router.get('', authentication, bookingController.getAllBookings);                     //lấy danh sách booking userId hoặc adminId
    router.get('/id', authentication, bookingController.getBookingById);                     //lấy danh sách booking theo tableId
    router.post('', authentication, checkRole('customer', 'staff'), bookingController.createBooking); // đặt lịch           
    router.put('/comment', authentication, checkRole('customer'), bookingController.createComment);                     // bình luận và đánh giá sau bữa ăn 
    router.put('', authentication, bookingController.updateBooking);                     // cập nhật thông tin booking theo id
    return app.use("/api/booking", router);
}
export default initBookingRoute;