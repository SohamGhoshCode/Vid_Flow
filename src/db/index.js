import mongoose from "mongoose";
import {db_name} from "../constants.js";

const connectDB = async()=>{
    try {// try to connect to the database using mongoose library 
        console.log("DB URI -->", `${process.env.MONGODB_URI}/${db_name}`);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`);
        console.log(`MongoDB connected to DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) { // handling error
        console.log("Error in coonnecting to DB: ", error); 
        process.exit(1); // Exit process with failure
    }
}
export default connectDB;