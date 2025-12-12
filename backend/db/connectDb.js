import mongoose from "mongoose";

export const connectDB = async (retries = 5) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); // Use the connection string from your environment variables
    console.log(`Mongodb connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
    if (retries === 0) {
      console.error("Max retries reached. Exiting...");
      process.exit(1); // Exit with failure
    }
    console.log(
      `Retrying connection in 5 seconds... (${retries} attempts left)`
    );
    setTimeout(() => connectDB(retries - 1), 5000);
  }
};
