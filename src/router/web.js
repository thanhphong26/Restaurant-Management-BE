import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

let router = express.Router();
let initWebRount = (app) => {
    //router.all("*", checkTokenWithCookie, checkAuthentication)

    router.get("/test", (req, res) => {
        res.send("Test");
    });

    return app.use("/api/", router);
}
export default initWebRount;