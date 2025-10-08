import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

export const dataBaseConnection = async () => {
  try {
    const res = await mongoose.connect(MONGODB_URI);
    console.log("DB Connected Successfully:", res.connection.host);
  } catch (error: unknown | Error) {
    if (error instanceof Error) {
      console.error("DB Connection Error:", error.message);
    } else {
      console.error("DB Connection Error:", error);
    }
    process.exit(1);
  }
};
