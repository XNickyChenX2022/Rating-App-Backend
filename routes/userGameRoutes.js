import express from "express";
const router = express.router();
import { authUser } from "../controllers/userController";
router.post("/", authUser);

export default router;
