import { Router } from "express";
import auth from "../middleware/auth.js";
import  {getSummary, getTransactions, previewTransaction, saveTransaction}  from "../controllers/transaction.js";

const router = Router();

// router.post("/", auth, addTransaction);


// 🔍 Step 1: Preview
router.post("/preview", auth, previewTransaction);

// 💾 Step 2: Save
router.post("/save", auth, saveTransaction);

router.get("/:projectId", auth, getTransactions);
router.get("/summary/:projectId", auth, getSummary);

export default router;