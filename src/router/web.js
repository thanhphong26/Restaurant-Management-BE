import express from 'express';
import dotenv from 'dotenv';
import userController from '../controllers/userController.js';
import foodController  from '../controllers/foodController.js';
import { authenticateToken, isAdmin, checkRole } from '../middleware/JWTAction.js';
dotenv.config();

import staffController from '../controllers/staffController.js';

let router = express.Router();
let initWebRount = (app) => {
    //router.all("*", checkTokenWithCookie, checkAuthentication)

    //staff
    router.get("/staff", staffController.getAllStaff);
    router.get("/staff/position/:position", staffController.getStaffByPosition);
    router.get("/staff/type/:type", staffController.getStaffByType);
    router.post('/users/register', userController.register);
    router.post('/users/login', userController.login);
    router.get('/users/profile', authenticateToken, userController.getProfile);
    router.put('/users/profile', authenticateToken, userController.updateProfile);
    router.post('/users/add-points', authenticateToken, isAdmin, userController.addPoints);
    router.get('/users/all', authenticateToken, isAdmin, userController.getAllUsers);

    router.get('/foods', foodController.getAllFoods);
    router.post('/foods',  authenticateToken, checkRole('admin','manager'), foodController.createFood);
    router.get('/foods/:id', foodController.getFoodById);
    router.delete('/foods/:id', authenticateToken, checkRole('admin','manager'), foodController.deleteFood);
    router.get('/foods/search', foodController.searchFoods);
    router.get('/foods/type/:type', foodController.getFoodsByType);
    router.put('/foods/:id/status', authenticateToken, checkRole('admin','manager'), foodController.updateFoodStatus);
    router.put('/foods/:id', authenticateToken, checkRole('admin','manager'), foodController.updateFood);
    router.get('/foods/stats', foodController.getFoodStats);

    return app.use("/api/", router);
}
export default initWebRount;