import express from 'express';
import dotenv from 'dotenv';
import paymentController from '../controllers/paymentController.js';
import { authentication } from '../middleware/JWTAction.js';

dotenv.config();
const router = express.Router();

const initDepositRoute = (app) => {
    router.post('', authentication, paymentController.createDeposit); 
    router.post('/callback', paymentController.handleDepositCallback); 

    return app.use('/api/deposit', router);
};

export default initDepositRoute;
