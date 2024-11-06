import express from 'express';
import dotenv from 'dotenv';
import promotionController from '../controllers/promotionController.js';
import { authentication, checkRole } from '../middleware/JWTAction.js';
dotenv.config();
let router = express.Router();
let initPromotionRoute = (app) => {
    
    router.get("", promotionController.getAllPromotionsValid);
    router.get("/by-user", promotionController.getPromotionValidByUserId);
    router.post("", authentication, checkRole('admin','manager'), promotionController.createPromotion);
    router.put("/:id", authentication, checkRole('admin','manager'), promotionController.updatePromotion);
    router.delete("/:id", authentication, checkRole('admin','manager'), promotionController.deletePromotion);
    
    return app.use("/api/promotion", router);
}
export default initPromotionRoute;