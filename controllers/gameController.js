import asyncHandler from "express-async-handler";
import Game from "../models/gameModel.js";
import User from "../models/userModel.js";
import GameReview from "../models/gameReviewModel.js";
// import { redisClient } from "../config/webhook.js";
import { connectRedis } from "../config/client.js";

let client = connectRedis();

const updateRedisCache = async (_id, gameReview, req) => {
  // const user = await User.findById(req.user._id).populate({
  //   path: "gameReviews",
  //   populate: {
  //     path: "game",
  //     model: "Game",
  //   },
  // });
  // const gameReviews = user.gameReviews;
  console.log(req.user._id.toString(), _id.toString());
  await client.hSet(
    `user:${req.user._id.toString()}:gameReviews`,
    _id.toString(),
    JSON.stringify(gameReview)
  );
};

//@desc   Search database for games
//@route  POST /api/games/search
//@access Private
const searchGames = asyncHandler(async (req, res) => {
  try {
    const { search } = req.body;
    const games = await Game.find({
      name: { $regex: search, $options: "i" },
    })
      .hint({ name: 1 })
      .limit(20);
    res.status(200).json(games);
  } catch (error) {
    res.status(400);
    throw new Error("unable to search games");
  }
});

//@desc   Add game to ones collection
//@route  POST /api/games
//@access Private
const addGame = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  const game = await Game.findOne({ _id: _id });
  if (!_id || !game) {
    res.status(404);
    throw new Error("Not valid game");
  }
  const user = await User.findById(req.user._id);
  const checkGameReview = await GameReview.findOne({
    user: user._id,
    game: _id,
  });
  if (checkGameReview != null) {
    res.status(401);
    throw new Error(`Game has already been added`);
  }
  const gameReview = await GameReview.create({
    game: _id,
    user: user._id,
  });
  user.gameReviews.push(gameReview._id);
  await user.save();
  await GameReview.populate(gameReview, "game");

  updateRedisCache(gameReview._id, gameReview, req);
  res.status(200).json(gameReview);
});

//@desc   Remove game to ones collection
//@route  DELETE /api/games
//@access Private
const removeGame = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  const user = await User.findById(req.user._id);
  const gameReview = await GameReview.findOne({ game: _id, user: user.id });
  if (gameReview == null) {
    res.status(404);
    throw new Error("game not found");
  }
  await GameReview.deleteOne({ _id: gameReview.id });
  await User.findOneAndUpdate(
    { _id: user.id },
    { $pull: { gameReview: gameReview.id } }
  );
  await client.hDel(`user:${req.user._id}:gameReviews`, gameReview.id);
  res.status(200).json({ _id: _id });
});

//@desc   Get all games from one's collection
//@route  GET /api/games
//@access PrivateUs

const getAllGames = asyncHandler(async (req, res) => {
  let cachedData = await client.hGetAll(`user:${req.user._id}:gameReviews`);
  if (cachedData && cachedData && Object.keys(cachedData).length > 0) {
    const jsonArray = Object.values(cachedData).map((jsonString) =>
      JSON.parse(jsonString)
    );
    res.status(200).json(jsonArray);
  } else {
    try {
      const user = await User.findById(req.user._id).populate({
        path: "gameReviews",
        populate: {
          path: "game",
          model: "Game",
        },
      });
      // client.hSet(
      //   `user:${req.user._id}:gameReviews`,
      //   "reviews",
      //   JSON.stringify(user.gameReviews)
      // );
      res.status(200).json(user.gameReviews);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

//@desc   Rate game to ones collection
//@route  PUT /api/games/rate
//@access Private
const rateGame = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  let { rating } = req.body;
  const regex = /^(?!\.)(?:10(?:\.0)?|\d(?:\.\d)?)$/;
  if (!regex.test(Number(rating))) {
    res.status(403);
    throw new Error("Not valid rating");
  } else {
    if (rating.indexOf(".") === -1) {
      rating += ".0";
    }
    if (rating.slice(-1) === ".") {
      rating += "0";
    }
    const gameReview = await GameReview.findOne({ _id: _id });
    await GameReview.populate(gameReview, "game");
    if (!gameReview) {
      throw new Error("Game not added to collection");
    }
    gameReview.rating = rating;
    await gameReview.save();
    updateRedisCache(gameReview._id, gameReview, req);
    res.status(200).json(gameReview.rating);
  }
});

//@desc   Review game from one's collection
//@route  PUT /api/games/review
//@access Private
const reviewGame = asyncHandler(async (req, res) => {
  const { _id, review } = req.body;
  const gameReview = await GameReview.findOne({ _id: _id });
  if (!gameReview) {
    throw new Error("Game not added to collection");
  }
  gameReview.review = review;
  await GameReview.populate(gameReview, "game");
  await gameReview.save();
  updateRedisCache(gameReview._id, gameReview, req);
  console.log(gameReview);
  res.status(200).json(gameReview.review);
});

export { searchGames, addGame, removeGame, getAllGames, rateGame, reviewGame };
