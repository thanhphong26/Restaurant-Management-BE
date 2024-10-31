import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
let router = express.Router();
let initRecruimentRoute = (app) => {
    
    return app.use("/api/recruiments/", router);
}
export default initRecruimentRoute;