import { Router } from "express";
import multer from "multer";
import { ObjectStorageService } from "../lib/objectStorage";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^(image|video)\//.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"));
    }
  },
});

const objectStorageService = new ObjectStorageService();
const router = Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  try {
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);

    const putRes = await fetch(uploadURL, {
      method: "PUT",
      body: req.file.buffer,
      headers: { "Content-Type": req.file.mimetype || "application/octet-stream" },
    }) as unknown as { ok: boolean; status: number };

    if (!putRes.ok) {
      req.log.error({ status: putRes.status }, "Object storage PUT failed");
      res.status(500).json({ error: "Upload to storage failed" });
      return;
    }

    res.json({ url: `/api/storage${objectPath}` });
  } catch (err) {
    req.log.error({ err }, "Upload to object storage failed");
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
