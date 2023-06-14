import mongoose from "mongoose";

// Connect to database
try {
  await mongoose.connect(process.env.MONGO_DB_URI)
  console.log('Database connected successfully')
} catch (error) {
  console.error("Error connecting to database: ", error)
}