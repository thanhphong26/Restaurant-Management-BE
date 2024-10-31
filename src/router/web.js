import express from 'express';
import dotenv from 'dotenv';
import userController from '../controllers/userController.js';
import foodController  from '../controllers/foodController.js';
import leaveApplicationController from '../controllers/leaveApplicationController.js';
import ingredientController from '../controllers/ingredientController.js';
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
    router.get('/foods/stats', foodController.getFoodStats); 
    router.get('/foods/search', foodController.searchFoods);
    router.get('/foods/:id', foodController.getFoodById);
    router.delete('/foods/:id', authenticateToken, checkRole('admin','manager'), foodController.deleteFood);
    router.get('/foods/type/:type', foodController.getFoodsByType);
    router.put('/foods/:id/status', authenticateToken, checkRole('admin','manager'), foodController.updateFoodStatus);
    router.put('/foods/:id', authenticateToken, checkRole('admin','manager'), foodController.updateFood);

    //leave application
    router.post("/leave-application", authenticateToken, leaveApplicationController.createLeaveApplication);
    router.put("/update-status-leave-application/:id", authenticateToken, checkRole('admin', 'manager'), leaveApplicationController.updateStatusLeaveApplication);
    router.put("/check-in", authenticateToken, leaveApplicationController.checkIn);
    router.put("/check-out", authenticateToken, leaveApplicationController.checkOut);
    router.get("/time-keeping", authenticateToken, checkRole('admin','manager'), leaveApplicationController.getTimeKeepingInMonth);
    router.get("/leave-application", authenticateToken, checkRole('admin','manager'), leaveApplicationController.getListLeaveApplication);
    
    //ingredients
    router.put("/ingredients/inventory", authenticateToken, checkRole('admin','manager'), ingredientController.updateIngredientInventory);
    router.get("/ingredients/stats", authenticateToken, checkRole('admin', 'manager') , ingredientController.getStatistics);
    router.get("/ingredients/expired", authenticateToken, checkRole('admin', 'manager'), ingredientController.checkExpiredIngredients);
    router.get("/ingredients/update-history", authenticateToken, checkRole('admin','manager'), ingredientController.getUpdatedHistory);
    router.get("/ingredients", ingredientController.getAllIngredients);
    router.get("/ingredients/:id", ingredientController.getIngredientById);
    router.delete("/ingredients/:id", authenticateToken, checkRole('admin','manager'), ingredientController.deleteIngredient);
    router.post("/ingredients", authenticateToken, checkRole('admin','manager'), ingredientController.createIngredient);
    router.put("/ingredients/:id", authenticateToken, checkRole('admin','manager'), ingredientController.updateIngredient);
    return app.use("/api/", router);
}
export default initWebRount;