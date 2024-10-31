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
dotenv.config();

const app = express();
app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
initAuthRoute(app);
initShiftRoute(app);
initBookingRoute(app);
initUserRoute(app);
initIngredientRoute(app);
initFoodRoute(app);
initLeaveApplicationRoute(app);
initStaffRoute(app);

app.get('/', (req, res) => {
    res.send('Hello World 123' );
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

