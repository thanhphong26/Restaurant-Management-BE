import express from 'express';
import dotenv from 'dotenv';
import paymentController from '../controllers/paymentController.js';
import { authentication } from '../middleware/JWTAction.js';

dotenv.config();
const router = express.Router();

const initPaymentRoute = (app) => {
    router.post('', paymentController.createPayment); // Tạo request thanh toán
    router.post('/callback', paymentController.callbackPayment); // Xử lý callback thanh toán

    return app.use('/api/payment', router);
};


export default initPaymentRoute;
