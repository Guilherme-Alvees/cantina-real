import express from "express";
import { getAllUsers, postNewUser, loginUser } from "../controllers/users.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/users", postNewUser);
router.post("/login", loginUser);

export default router;
