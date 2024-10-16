// mongoose.js
import mongoose from "mongoose";

async function connectMongoDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/restaurant-management", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000,
      connectTimeoutMS: 60000,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
  }
}

export { connectMongoDB };
export default mongoose;