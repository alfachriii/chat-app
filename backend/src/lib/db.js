import mongoose from "mongoose"
import {config} from "dotenv"
config()

const mongoDbUri = process.env.MONGODB_URI

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoDbUri)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection error: ", error)
    }
}