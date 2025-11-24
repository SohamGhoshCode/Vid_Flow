import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({
    limit: '16kb' // for parsing application/json and limit size for form uploads
}));
app.use(express.urlencoded({
    extended: true, // url links encoded data 
    limit: '16kb'
}))
app.use(express.static("public")); // to serve static files like images ,css ,js, etc.
app.use(cookieParser());

//Routes Import
import userRoutes from "./routes/user.routes.js";

//Using Routes
app.use("/api/v1/users",userRoutes);
//http://localhost:8000/api/v1/users/register
export { app };