import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

let dbConnection = async () => {
  try {
    let con = await mongoose.connect(`${process.env.DB_URL}`);
    console.log(`mongodb connected successfully ${con.connection.host}`);
  } catch (error) {
    console.log(`mongodb not connected successfully`);
    process.exit(1);
  }
};

export default dbConnection;
