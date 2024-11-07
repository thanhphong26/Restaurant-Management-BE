import express from 'express';
import dotenv from 'dotenv';
import { createPayment, handleReturnUrl } from '../controllers/paymentController.js';

dotenv.config();
const router = express.Router();

const initPaymentRoute = (app) => {
    // Định nghĩa các route thanh toán
    router.post('/create_payment', createPayment);
    router.get('/vnpay_return', handleReturnUrl);
    return app.use('', router); // Tích hợp các route vào ứng dụng
}

export default initPaymentRoute;
