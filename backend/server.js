import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import connectToMongodb from "./db/mongodbConnection.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const PORT=process.env.PORT || 3000;
const app =express(); 

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)
app.use("/api/users",userRoutes);





app.listen(PORT,'localhost',()=>{
    connectToMongodb();   
    console.log(`Server is running on localhost:${PORT}`)
});