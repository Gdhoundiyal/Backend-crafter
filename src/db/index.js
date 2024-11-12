import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


console.log(process.env.MONGODB_URI)
const connectDB = async () => {
    try {

        console.log("conncetion db")
        const connectionInstances = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log('MongoDB connected !!')

    } catch (error){
        console.log("Mongodb connection Error: ", error)
        process.exit(1)
    }
}
export default connectDB