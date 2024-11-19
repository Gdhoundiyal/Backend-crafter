import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const connectionInstances = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log('MongoDB connected !!')

    } catch (error){
        console.log("Mongodb connection Error: ", error)
        process.exit(1)
    }
}
export default connectDB    