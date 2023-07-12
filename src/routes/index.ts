import { Router } from "express";
import getStockPrice from "../controller";

const router = Router();

router.get("/stock-price", getStockPrice);

export default router;
