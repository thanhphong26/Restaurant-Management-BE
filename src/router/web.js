// import express from 'express';
// import dotenv from 'dotenv';
// import userController from '../controllers/userController.js';
// import foodController  from '../controllers/foodController.js';
// import leaveApplicationController from '../controllers/leaveApplicationController.js';
// import ingredientController from '../controllers/ingredientController.js';
// import { authentication, checkRole } from '../middleware/JWTAction.js';
// dotenv.config();

// import staffController from '../controllers/staffController.js';

// let router = express.Router();
// let initWebRount = (app) => {
//     //router.all("*", checkTokenWithCookie, checkAuthentication)

//     //staff
//     router.get("/staff", staffController.getAllStaff);
//     router.get("/staff/position/:position", staffController.getStaffByPosition);
//     router.get("/staff/type/:type", staffController.getStaffByType);
//     router.post('/users/register', userController.register);
//     router.post('/users/login', userController.login);
//     router.get('/users/profile', authentication, userController.getProfile);
//     router.put('/users/profile', authentication, userController.updateProfile);
//     router.post('/users/add-points', authentication, isAdmin, userController.addPoints);
//     router.get('/users/all', authentication, isAdmin, userController.getAllUsers);

//     router.get('/foods', foodController.getAllFoods);
//     router.post('/foods',  authentication, checkRole('admin','manager'), foodController.createFood);
//     router.get('/foods/stats', foodController.getFoodStats); 
//     router.get('/foods/search', foodController.searchFoods);
//     router.get('/foods/:id', foodController.getFoodById);
//     router.delete('/foods/:id', authentication, checkRole('admin','manager'), foodController.deleteFood);
//     router.get('/foods/type/:type', foodController.getFoodsByType);
//     router.put('/foods/:id/status', authentication, checkRole('admin','manager'), foodController.updateFoodStatus);
//     router.put('/foods/:id', authentication, checkRole('admin','manager'), foodController.updateFood);

//     //leave application
//     router.post("/leave-application", authentication, leaveApplicationController.createLeaveApplication);
//     router.put("/update-status-leave-application/:id", authentication, checkRole('admin', 'manager'), leaveApplicationController.updateStatusLeaveApplication);
//     router.put("/check-in", authentication, leaveApplicationController.checkIn);
//     router.put("/check-out", authentication, leaveApplicationController.checkOut);
//     router.get("/time-keeping", authentication, checkRole('admin','manager'), leaveApplicationController.getTimeKeepingInMonth);
//     router.get("/leave-application", authentication, checkRole('admin','manager'), leaveApplicationController.getListLeaveApplication);
    
//     //ingredients
//     router.put("/ingredients/inventory", authentication, checkRole('admin','manager'), ingredientController.updateIngredientInventory);
//     router.get("/ingredients/stats", authentication, checkRole('admin', 'manager') , ingredientController.getStatistics);
//     router.get("/ingredients/expired", authentication, checkRole('admin', 'manager'), ingredientController.checkExpiredIngredients);
//     router.get("/ingredients/update-history", authentication, checkRole('admin','manager'), ingredientController.getUpdatedHistory);
//     router.get("/ingredients", ingredientController.getAllIngredients);
//     router.get("/ingredients/:id", ingredientController.getIngredientById);
//     router.delete("/ingredients/:id", authentication, checkRole('admin','manager'), ingredientController.deleteIngredient);
//     router.post("/ingredients", authentication, checkRole('admin','manager'), ingredientController.createIngredient);
//     router.put("/ingredients/:id", authentication, checkRole('admin','manager'), ingredientController.updateIngredient);
//     return app.use("/api/", router);
// }
// export default initWebRount;