import dotenv from "dotenv";
dotenv.config();

console.log("JWT_SECRET =", process.env.JWT_SECRET);

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import resultRouter from "./routes/resultRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRouter);
app.use("/api/results", resultRouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});