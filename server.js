import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
// import webhookRoutes from "./routes/webhookRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
// import connectRedis from "./config/client.js";
// import registerWebhooks from "./config/webhook.js";
import friendRoutes from "./routes/friendRoutes.js";
import cors from "cors";
dotenv.config();
const port = process.env.PORT || 5000;

connectDB();
// connectRedis();
// registerWebhooks();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://xnickychenx2022.github.io",
    credentials: true,
  })
);
app.use("/api/users", userRoutes);
// app.use("/api/webhooks", webhookRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/friends", friendRoutes);
app.get("/", (req, res) => res.send("API running"));
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => console.log(`Server Started on Port:${port}`));
