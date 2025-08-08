import { Router } from "express";
import ticketsRoutes from "./tickets.route";

const router = Router();

router.use("/", ticketsRoutes);

export default router;
