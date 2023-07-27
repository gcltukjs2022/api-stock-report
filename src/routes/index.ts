import { Router } from "express";
import getReport from "../controller";

const router = Router();

router.get("/stock-report", getReport);

export default router;
