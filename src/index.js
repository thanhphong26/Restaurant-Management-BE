import express from 'express';
import { connectMongoDB } from "./mongoose/mongoose.js";
import initWebRount from './router/web.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

connectMongoDB();

initWebRount(app);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

