import { Router } from "express";
import { addProduct, getProducts, getProductsDetail, updateProduct } from "../controllers/product.controller";
import upload from "../middlewares/multerConfig";


const router = Router();


router.post("/add", upload.array("images", 5) ,addProduct);
router.get("/list", getProducts);

router.put("/update", updateProduct);

router.get("/detail/:product_id", getProductsDetail);

export default router;