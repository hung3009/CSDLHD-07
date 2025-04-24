import { Router } from "express";
import { addToCart, getCartList } from "../controllers/cart.controller";


const router = Router();


router.post("/add" , addToCart);

router.get("/list/:userId", getCartList);


// router.get("/list", getProducts);

export default router;