import express from 'express';
import dotenv from 'dotenv';
import userController from '../controllers/userController.js';
dotenv.config();
let router = express.Router();
let initAuthRoute = (app) => {
    router.post('/register', userController.register);
    router.post('/login', userController.login);
    return app.use("/api/", router);
}
export default initAuthRoute;