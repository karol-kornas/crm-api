import "dotenv/config";
import express from "express";
import authRoutes from "./auth/routes/auth.routes";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(errorHandler);

export default app;
