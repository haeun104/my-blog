import express from "express";
import {
  deleteUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", verifyUser, updateUserProfile);
router.delete("/delete/:userId", verifyUser, deleteUser);

export default router;
