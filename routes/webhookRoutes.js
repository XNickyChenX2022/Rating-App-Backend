import express from "express";
const router = express.Router();
import {
  registerWebhook,
  createGames,
} from "../controllers/webhookController.js";

router.post("/", registerWebhook);
router.post("/create", createGames);

export default router;
