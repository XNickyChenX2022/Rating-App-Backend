import asyncHandler from "express-async-handler";
import Game from "../models/gameModel.js";

const createGames = asyncHandler(async (req, res) => {
  const id = req.body.id;
  const response = await fetch(`https://api.igdb.com/v4/games`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": process.env.CLIENT_ID,
      Authorization: "Bearer " + process.env.access_token,
    },
    body: `fields name, cover.image_id, platforms.name, genres.name, category, remakes.name, remasters.name, dlcs.name, expansions.name, involved_companies.company.name, involved_companies.publisher, involved_companies.developer;  where category = (0) & version_parent = null & cover.image_id != null & involved_companies.company.name != null & id=${id};`,
  });
  const games = await response.json();
  console.log(games);
  if (games.length == 0) {
    res.status(200).send("OK");
  } else {
    const game = games[0];
    console.log(`creating new games - ${game.name}`);
    await Game.create({
      _id: game.id,
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
  const response = await fetch(`https://api.igdb.com/v4/games`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": process.env.CLIENT_ID,
      Authorization: "Bearer " + process.env.access_token,
    },
    body: `fields name, cover.image_id, platforms.name, genres.name, category, remakes.name, remasters.name, dlcs.name, expansions.name, involved_companies.company.name, involved_companies.publisher, involved_companies.developer;  where category = (0) & version_parent = null & cover.image_id != null & involved_companies.company.name != null & id=${id};  `,
  });
  const games = await response.json();
  if (games.length == 0) {
    res.status(200).send("No game needed to be updated");
  } else {
    const game = games[0];
    console.log(`updating games - ${game.name}`);
    await Game.findOneAndUpdate(
      { id },
      {
        _id: game.id,
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
    res.status(200).json(game.name);
  }
});

export { createGames, updateGames };
