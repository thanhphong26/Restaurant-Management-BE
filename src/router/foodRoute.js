import express from 'express';
import dotenv from 'dotenv';
import foodController  from '../controllers/foodController.js';
import { authentication, checkRole } from '../middleware/JWTAction.js';
dotenv.config();
let router = express.Router();
let initFoodRoute = (app) => {
    router.get('', foodController.getAllFoods);
    router.post('',  authentication, checkRole('admin','manager'), foodController.createFood);
    router.get('/stats', foodController.getFoodStats); 
    router.get('/:id', foodController.getFoodById);
    router.delete('/:id', authentication, checkRole('admin','manager'), foodController.deleteFood);
    router.get('/type/:type', foodController.getFoodsByType);
    router.put('/:id/status', authentication, checkRole('admin','manager'), foodController.updateFoodStatus);
    router.put('/:id', authentication, checkRole('admin','manager'), foodController.updateFood);

    return app.use("/api/foods/", router);
}
export default initFoodRoute;