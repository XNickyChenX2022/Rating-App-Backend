import asyncHandler from "express-async-handler";
import Game from "../models/gameModel.js";
// const webhooks = async (type) => {
//   try {
//     const response = await fetch("https://api.igdb.com/v4/games/webhooks/", {
//       method: "POST",
//       headers: {
//         Accept: "application/x-www-form-urlencoded",
//         "Client-ID": process.env.CLIENT_ID,
//         Authorization: "Bearer " + process.env.access_token,
//       },
//       body: new URLSearchParams({
//         url: process.env.WEBHOOK_URL + `/api/webhooks/${type}`,
//         secret: process.env.WEBHOOK_SECRET,
//         method: type,
//       }).toString(),
//     });
//     const data = await response.json();
//   } catch (error) {}
// };
// const registerWebhooks = asyncHandler(async (req, res) => {
//   try {
//     const response = await fetch("https://api.igdb.com/v4/games/webhooks/", {
//       method: "POST",
//       headers: {
//         Accept: "application/x-www-form-urlencoded",
//         "Client-ID": process.env.CLIENT_ID,
//         Authorization: "Bearer " + process.env.access_token,
//       },
//       body: new URLSearchParams({
//         url: process.env.WEBHOOK_URL + "/api/webhooks/create",
//         secret: process.env.WEBHOOK_SECRET,
//         method: "create",
//       }).toString(),
//     });
//     const data = await response.json();
//     // console.log(data);
//     res.status(200).send(data);
//   } catch (error) {
//     res.status(400);
//     throw new Error("unable to register webhook");
//   }
// });

const createGames = asyncHandler(async (req, res) => {
  const id = req.body.id;
  const response = await fetch(`https://api.igdb.com/v4/games`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": process.env.CLIENT_ID,
      Authorization: "Bearer " + process.env.access_token,
    },
    body: `fields name, cover.image_id, platforms.name, category, remakes.name, remasters.name, dlcs.name, expansions.name, involved_companies.company.name; where category = (0) & version_parent = null & cover.image_id != null & involved_companies.company.name != null & id=${id};  `,
  });
  const games = await response.json();
  console.log(games);
  if (games.length == 0) {
    res.status(200).send("OK");
  } else {
    const game = games[0];
    await Game.create({
      id: game.id,
      cover: game.cover,
      dlcs: game.dlcs,
      expansions: game.expansions,
      involved_companies: game.involved_companies,
      name: game.name,
      platforms: game.platforms,
      remakes: game.remakes,
      remasters: game.remasters,
    });
    res.status(200).send("OK");
  }
});

const updateGames = asyncHandler(async (req, res) => {
  const { id } = req.body;
  console.log({ id });
  const response = await fetch(`https://api.igdb.com/v4/games`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": process.env.CLIENT_ID,
      Authorization: "Bearer " + process.env.access_token,
    },
    body: `fields name, cover.image_id, platforms.name, category, remakes.name, remasters.name, dlcs.name, expansions.name, involved_companies.company.name; where category = (0) & version_parent = null & cover.image_id != null & involved_companies.company.name != null & id=${id};  `,
  });
  const games = await response.json();
  console.log(games);
  if (games.length == 0) {
    res.status(200).send("OK");
  } else {
    const game = games[0];
    await Game.findOneAndUpdate(
      { id },
      {
        id: game.id,
        cover: game.cover,
        dlcs: game.dlcs,
        expansions: game.expansions,
        involved_companies: game.involved_companies,
        name: game.name,
        platforms: game.platforms,
        remakes: game.remakes,
        remasters: game.remasters,
      }
    );
    res.status(200).send("OK");
  }
});

export { createGames, updateGames };
