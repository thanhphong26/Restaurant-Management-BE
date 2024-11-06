import mongoose from "mongoose";
const uri = "mongodb+srv://res-management:123456789cnpm@cnpm-24.8eby1.mongodb.net/res-management?retryWrites=true&w=majority&appName=cnpm-24";

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
};

let isConnecting = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL = 5000; // 5 seconds

async function connectDB() {
  if (isConnecting) return;
  isConnecting = true;

  try {
    await mongoose.connect(uri, clientOptions);
    console.log("Successfully connected to MongoDB");
    reconnectAttempts = 0;
    isConnecting = false;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    isConnecting = false;
    handleReconnect();
  }
}

function handleReconnect() {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error(`Failed to reconnect after ${MAX_RECONNECT_ATTEMPTS} attempts. Exiting...`);
    process.exit(1);
  }

  reconnectAttempts++;
  console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) in ${RECONNECT_INTERVAL / 1000} seconds...`);
  
  setTimeout(() => {
    connectDB();
  }, RECONNECT_INTERVAL);
}

const db = mongoose.connection;

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
  if (!isConnecting) {
    handleReconnect();
  }
});

db.on("error", (error) => {
  console.error("MongoDB error:", error);
  if (!isConnecting) {
    handleReconnect();
  }
});

connectDB();

export { db };