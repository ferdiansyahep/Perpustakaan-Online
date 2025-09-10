import { Router } from "express";
import { borrowBook, returnBook, listLoans } from "../controllers/loanController.js";
import { auth } from "../middleware/auth.js";

const router = Router();
router.post("/", auth(), borrowBook);
router.post("/:id/return", auth(), returnBook);
router.get("/", auth(), listLoans);

export default router;
