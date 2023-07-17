import { Router } from "express";
import getReport from "../controller";

const router = Router();

router.get("/stock-price", getReport);

export default router;
