import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors({credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.get("/",(req,res)=>{
  res.send("server is running");
})



app.listen(PORT, () => {
  connectDB();
  console.log("server running at port: ", PORT);
});
//
