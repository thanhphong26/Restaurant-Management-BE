import express from 'express';
import dotenv from 'dotenv';
import userController from '../controllers/userController.js';
import { authentication, checkRole } from '../middleware/JWTAction.js';
dotenv.config();
let router = express.Router();
let initUserRoute = (app) => {
    router.get('/profile', authentication, userController.getProfile);
    router.put('/profile', authentication, userController.updateProfile);
    router.get('/all', authentication, checkRole('admin'), userController.getAllUsers);
    router.post('/logout', authentication, userController.logout);
    return app.use("/api/users", router);
}
export default initUserRoute;