import { Router } from "express";
import projectsRoutes from "./projects.route";
import membersRoutes from "./members.route";
import credentialsRoutes from "./credentials.route";
import ticketsRoutes from "./tickets.route";

const router = Router();

router.use("/", projectsRoutes);
router.use("/", membersRoutes);
router.use("/", credentialsRoutes);

router.use("/", ticketsRoutes);

export default router;
