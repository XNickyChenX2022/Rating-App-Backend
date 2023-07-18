import express from "express";
const router = express.Router();
import { searchGames } from "../controllers/searchController.js";
router.post("/", searchGames);

export default router;
