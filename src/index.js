import express from 'express';
import mongoose from "mongoose";
import { db } from './mongoose/mongoose.js';
import dotenv from 'dotenv';
import corsConfig from './middleware/corsConfig.js';
import initFoodRoute from './router/foodRoute.js';
import initUserRoute from './router/userRoute.js';
import initIngredientRoute from './router/ingredientRoute.js';
import initLeaveApplicationRoute from './router/leaveApplicationRoute.js';
import initStaffRoute from './router/staffRoute.js';
import initAuthRoute from './router/authRoute.js';
import initShiftRoute from './router/shiftRoute.js';
import initBookingRoute from './router/bookingRoute.js';
import initTimeKeepingRoute from './router/timeKeepingRoute.js';
import initPromotionRoute from './router/promotionRoute.js';
import initApplicationRoute from './router/applicationRoute.js';
import initRecruimentRoute from './router/recruimentRoute.js';
import initTableRoute from './router/tableRoute.js';
import initReportRoute from './router/reportRoute.js';
import cookieParser from 'cookie-parser';
import initPaymentRoute from './router/paymentRoute.js';
import { errorHandler } from './middleware/JWTAction.js';
dotenv.config();

const app = express();

//Application-level middleware
app.use(corsConfig); //Third-party middleware for CORS
app.use(cookieParser()); //Third-party middleware for parsing cookies
app.use(express.json()); //Built-in middleware for parsing JSON
app.use(express.urlencoded({ extended: true })); //Built-in middleware for parsing URL-encoded data
const port = process.env.PORT || 3000;

//Router-level middleware
initAuthRoute(app);
initShiftRoute(app);
initBookingRoute(app);
initUserRoute(app);
initIngredientRoute(app);
initFoodRoute(app);
initLeaveApplicationRoute(app);
initStaffRoute(app);
initTimeKeepingRoute(app);
initPromotionRoute(app);
initApplicationRoute(app);
initRecruimentRoute(app);
initTableRoute(app);
initBookingRoute(app);
initReportRoute(app);
initPaymentRoute(app);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

