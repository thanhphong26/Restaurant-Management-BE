import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
let router = express.Router();
let initShiftRoute = (app) => {
    
    return app.use("/api/shift/", router);
}
export default initShiftRoute;