import express from 'express';
import dotenv from 'dotenv';
import ingredientController from '../controllers/ingredientController.js';
import { authentication, checkRole } from '../middleware/JWTAction.js';
dotenv.config();
let router = express.Router();
let initUpdateIngredientRoute = (app) => {
    //ingredients
    router.put("/:id", authentication, checkRole('admin','manager'), ingredientController.updateIngredientInventory);
    router.get("/stats", authentication, checkRole('admin', 'manager') , ingredientController.getStatistics);
    router.get("/expired", authentication, checkRole('admin', 'manager'), ingredientController.checkExpiredIngredients);
    router.get("/update-history", authentication, checkRole('admin','manager'), ingredientController.getUpdatedHistory);
    return app.use("/api/update-ingredients", router);
}
export default initUpdateIngredientRoute;