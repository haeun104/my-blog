import express from "express";
import { updateUserProfile } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", verifyUser, updateUserProfile);

export default router;
