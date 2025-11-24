import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
});
connectDB().then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    })
})
.catch((err)=>{
    console.log("MONGO DB connection failed",err);
});










/*//this is for local mongo db connection of simple approach async await because database
//alsways run on the different continent so it may take time to connect
import express from "express";
const app = express();
(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`)
        app.on("Error",(error)=>{
            console.log("Error: ",error);
            throw error;
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port -> ${process.env.PORT}`);
        })
    }
    catch(error){
        console.error("Error: ", error);
    }
})()

*/