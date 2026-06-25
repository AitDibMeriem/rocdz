import { Router, type IRouter } from "express";
import healthRouter from "./health";
import laptopsRouter from "./laptops";
import accessoriesRouter from "./accessories";
import brandsRouter from "./brands";
import uploadRouter from "./upload";
import authRouter from "./auth";
import promoCodesRouter from "./promo-codes";
import ordersRouter from "./orders";
import categoriesRouter from "./categories";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/laptops", laptopsRouter);
router.use("/accessories", accessoriesRouter);
router.use("/brands", brandsRouter);
router.use("/promo-codes", promoCodesRouter);
router.use("/orders", ordersRouter);
router.use("/categories", categoriesRouter);
router.use(uploadRouter);

export default router;
