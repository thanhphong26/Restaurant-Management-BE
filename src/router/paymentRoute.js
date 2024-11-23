import express from 'express';
import dotenv from 'dotenv';
import paymentController from '../controllers/paymentController.js';

dotenv.config();
const router = express.Router();

const initPaymentRoute = (app) => {
    // Định nghĩa các route thanh toán
    router.post('', paymentController.createPayment); // Tạo request thanh toán
    router.post('/callback', paymentController.callbackPayment); // Xử lý callback từ MoMo

    return app.use('/api/payment', router);
}

export default initPaymentRoute;
