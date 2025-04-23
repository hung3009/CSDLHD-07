import { Router } from "express";
import { addInventory, getInventoryList } from "../controllers/inventory.controller";


const router = Router();

router.post("/add", addInventory);

router.get("/list", getInventoryList);

export default router;