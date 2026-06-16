import { Router, type IRouter } from "express";
import healthRouter from "./health";
import laptopsRouter from "./laptops";
import accessoriesRouter from "./accessories";
import brandsRouter from "./brands";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/laptops", laptopsRouter);
router.use("/accessories", accessoriesRouter);
router.use("/brands", brandsRouter);

export default router;
