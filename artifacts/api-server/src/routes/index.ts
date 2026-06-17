import { Router, type IRouter } from "express";
import healthRouter from "./health";
import laptopsRouter from "./laptops";
import accessoriesRouter from "./accessories";
import brandsRouter from "./brands";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/laptops", laptopsRouter);
router.use("/accessories", accessoriesRouter);
router.use("/brands", brandsRouter);
router.use(uploadRouter);

export default router;
