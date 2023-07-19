import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
dotenv.config();
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import connectRedis from "./config/client.js";
const port = process.env.PORT || 5000;

connectDB();
connectRedis();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/search", searchRoutes);
// app.use("/api/users/games", userGameRoutes);
// async function sleep(millis) {
//     return new Promise(resolve => setTimeout(resolve, millis));
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
//       body: `fields name, cover.image_id, platforms.name, category, remakes.name, remasters.name, dlcs.name, expansions.name, involved_companies.company.name; where category = (0) & version_parent = null & name!= null & cover.image_id != null;
//   offset ${i}; limit 500;`,
//     });
//     const games = await response.json();
//     console.log(i);
//     games.map(async (game) => {
//       await Game.create({
//         id: game.id,
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
//   for (let i = 0; i < 150554; i += 500) {
//     await sleep(10000);
//     await get(i);
//   }
// }
// setTimeout(loop, 10000);

app.get("/", (req, res) => res.send("API running"));
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => console.log(`Server Started on Port:${port}`));
