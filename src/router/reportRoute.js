import express from 'express';
import dotenv from 'dotenv';
import { authentication, checkRole } from '../middleware/JWTAction.js';
import reportController from '../controllers/reportController.js';
import exportController from '../controllers/exportController.js';
dotenv.config();

let router = express.Router();
let initReportRoute = (app) => {
    router.get('/revenue', authentication, checkRole('admin'), reportController.getRevenue);
    router.get('/export-revenue/excel', authentication, checkRole('admin'), exportController.exportRevenueToExcel);
    router.get('/revenue-ingredients', authentication, checkRole('admin'), reportController.getRevenueIngredients);
    return app.use("/api/report", router);
}
export default initReportRoute;