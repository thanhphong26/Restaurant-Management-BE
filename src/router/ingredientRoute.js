import express from 'express';
import dotenv from 'dotenv';
import ingredientController from '../controllers/ingredientController.js';
import { authentication, checkRole } from '../middleware/JWTAction.js';
dotenv.config();
let router = express.Router();
let initIngredientRoute = (app) => {
    //ingredients
    router.put("/inventory/:id", authentication, checkRole('admin','manager'), ingredientController.updateIngredientInventory);
    router.get("/stats", authentication, checkRole('admin', 'manager') , ingredientController.getStatistics);
    router.get("/expired", authentication, checkRole('admin', 'manager'), ingredientController.checkExpiredIngredients);
    router.get("/update-history", authentication, checkRole('admin','manager'), ingredientController.getUpdatedHistory);
    router.get("", ingredientController.getAllIngredients);
    router.get("/:id", ingredientController.getIngredientById);
    router.delete("/:id", authentication, checkRole('admin','manager'), ingredientController.deleteIngredient);
    router.post("", authentication, checkRole('admin','manager'), ingredientController.createIngredient);
    router.put("/:id", authentication, checkRole('admin','manager'), ingredientController.updateIngredient);
    return app.use("/api/ingredients", router);
}
export default initIngredientRoute;