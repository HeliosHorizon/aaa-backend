import { Router } from "express";
import { sendOTP,verifyOTP } from "../controllers/auth.js";
const router = Router();

router.get("/", (req, res) => {
  res.send("Auth route working");
});
router.post("/send-otp",sendOTP)
router.post("/verify-otp",verifyOTP)

export default router;