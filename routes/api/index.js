import { Router } from "express";
const router = Router();

router.use("/", require("./users"));

export default router;
