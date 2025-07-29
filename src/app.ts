import "dotenv/config";
import express from "express";
import authRoutes from "./auth/routes/auth.routes";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";
import projectRoutes from "./project/routes/project.routes";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use(errorHandler);

export default app;
