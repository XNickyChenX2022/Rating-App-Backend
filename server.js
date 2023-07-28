import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import connectRedis from "./config/client.js";
import registerWebhooks from "./config/webhook.js";
import friendRoutes from "./routes/friendRoutes.js";
import Game from "./models/gameModel.js";
dotenv.config();
const port = process.env.PORT || 5000;

connectDB();
connectRedis();
registerWebhooks();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/friends", friendRoutes);
// async function sleep(millis) {
//   return new Promise((resolve) => setTimeout(resolve, millis));
// }

// async function get(i) {
//   try {
//     const response = await fetch(`https://api.igdb.com/v4/games`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Client-ID": process.env.CLIENT_ID,
//         Authorization: "Bearer " + process.env.access_token,
//       },
//       body: `fields name, cover.image_id, platforms.name, category, remakes.name, remasters.name, dlcs.name, expansions.name, involved_companies.company.name, involved_companies.publisher, involved_companies.developer;  where category = (0) & version_parent = null & cover.image_id != null & involved_companies.company.name != null; 
//   offset ${i}; limit 500;`,
//     });
//     const games = await response.json();
//     console.log(i);
//     games.map(async (game) => {
//       await Game.create({
//         _id: game.id,
//         cover: game.cover,
//         dlcs: game.dlcs,
//         expansions: game.expansions,
//         involved_companies: game.involved_companies,
//         name: game.name,
//         platforms: game.platforms,
//         remakes: game.remakes,
//         remasters: game.remasters,
//       });
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }
// async function loop() {
//   for (let i = 0; i < 78432; i += 500) {
//     await sleep(10000);
//     await get(i);
//   }
// }
// setTimeout(loop, 10000);

app.get("/", (req, res) => res.send("API running"));
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => console.log(`Server Started on Port:${port}`));
