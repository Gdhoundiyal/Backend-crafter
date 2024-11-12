import dotenv from "dotenv"
import connectDB from "./db/index.js";

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";


dotenv.config({
    path: './env'
})
console.log("connection");

connectDB()
.then(()=>{})
.catch(err, ()=>{
        console.log("app error", err);
})





/*
import express from 'express'
const app = express();

(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on('error',(error)=>{
            console.log("error while connecting ", error)
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is running on ${process.env.PORT}`)
        })
    }catch(error){
        console.log("Error", error)
    }
})()
    */