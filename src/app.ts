import "dotenv/config";
import express from "express";
import authRoutes from "./modules/auth/routes/auth.route";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error-middleware";
import projectsRoutes from "./modules/projects/routes/index.route";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use(errorHandler);

export default app;
