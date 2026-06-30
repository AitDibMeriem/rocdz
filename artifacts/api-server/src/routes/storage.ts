import { Router } from "express";

const router = Router();

router.all("*", (_req, res) => {
  res.status(410).json({ error: "Object storage has been replaced by Cloudinary" });
});

export default router;
