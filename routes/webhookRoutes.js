import express from "express";
const router = express.Router();
import {
  //   registerWebhooks,
  createGames,
  updateGames,
} from "../controllers/webhookController.js";

// router.post("/", registerWebhooks);
router.post("/create", createGames);
router.post("/update", updateGames);

export default router;
