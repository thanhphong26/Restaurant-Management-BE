import express from 'express';
import mongoose from "mongoose";
import initWebRount from './router/web.js';
import { db } from './mongoose/mongoose.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

initWebRount(app);

app.get('/', (req, res) => {
    res.send('Hello World 123' );
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

