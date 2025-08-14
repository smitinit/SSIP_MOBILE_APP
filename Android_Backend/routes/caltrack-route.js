import express from "express";
import multer from "multer";
import { generateCaltrack } from "../controller/caltrack-controller.js";

const router = express.Router();
const upload = multer();

router.post("/analyze-nutrition", upload.single("image"), generateCaltrack);

export default router;
