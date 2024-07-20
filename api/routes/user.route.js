import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", verifyUser, updateUserProfile);
router.delete("/delete/:userId", verifyUser, deleteUser);
router.get("/getUsers", verifyUser, getUsers);
router.get("/:userId", getUser);

export default router;
