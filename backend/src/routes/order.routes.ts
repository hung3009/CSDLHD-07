import { Router } from "express";
import { getClientOrder, getOrderList } from "../controllers/oder.controller";

const router = Router();

router.get("/list", getOrderList);

router.get("/list/client", getClientOrder);


export default router;