import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
let router = express.Router();
let initBookingRoute = (app) => {
    
    return app.use("/api/booking/", router);
}
export default initBookingRoute;