import { Router } from "express";
import { getListNoti } from "../controllers/noti.controller";



const router = Router();

router.get("/list/:sellerId", getListNoti);


export default router;