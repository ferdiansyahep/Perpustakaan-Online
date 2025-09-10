import { Router } from "express";
import { listBooks, getBook, createBook, updateBook, deleteBook } from "../controllers/bookController.js";
import { auth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();
router.get("/", listBooks);
router.get("/:id", getBook);
router.post("/", auth("ADMIN"), upload.single("cover"), createBook);
router.put("/:id", auth("ADMIN"), upload.single("cover"), updateBook);
router.delete("/:id", auth("ADMIN"), deleteBook);

export default router;
