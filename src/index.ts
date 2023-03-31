import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

dotenv.config();

const port = process.env.PORT || 3000;

// Connect to the database
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1);
  }
};

// Start the server
const startServer = () => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

// Connect to the database and start the server
connectToDatabase().then(startServer);
