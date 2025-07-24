import "dotenv/config";
import express from "express";
import authRoutes from "./auth/routes/auth.routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);

export default app;
