import { Router } from "express";
import projectsRoutes from "./projects.route";
import membersRoutes from "./members.route";
import credentialsRoutes from "./credentials.route";

const router = Router();

router.use("/", projectsRoutes);
router.use("/", membersRoutes);
router.use("/", credentialsRoutes);

export default router;
