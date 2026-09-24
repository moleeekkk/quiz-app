import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/quiz_db";

    const conn = await mongoose.connect(mongoUri);
    console.log("MongoDB Connected Successfully...");
  } catch (error) {
    console.error(`Connection Error: ${error.message}`);
  }
};

