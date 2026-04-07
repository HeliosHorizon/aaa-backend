import { Router } from "express";
import auth from "../middleware/auth.js";
import  {addTransaction, getSummary, getTransactions}  from "../controllers/transaction.js";

const router = Router();

router.post("/", auth, addTransaction);

router.get("/:projectId", auth, getTransactions);
router.get("/summary/:projectId", auth, getSummary);

export default router;