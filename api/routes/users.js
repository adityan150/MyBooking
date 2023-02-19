import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// PATH: /api/users

// AUTH
router.get("/checkauthentication", verifyToken, (req, res, next) => {
  res.send("You are authenticated.");
});

router.get("/checkuser/:id", verifyUser, (req, res, next) => {
  res.send("You are authorized.");
});

router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
  res.send("You are admin.");
});

// UPDATE
router.put("/:id", verifyUser, updateUser);

// DELETE
router.delete("/:id", verifyUser, deleteUser);

// GET
router.get("/:id", verifyUser, getUser);

// GET ALL
router.get("/", verifyAdmin, getUsers);

export default router;
