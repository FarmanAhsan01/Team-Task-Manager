import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "backend_auth_db";
  await mongoose.connect(`${uri}/${dbName}`);
  console.log("MongoDB connected");
};

export default connectDB;
