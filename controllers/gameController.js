import asyncHandler from "express-async-handler";
import Game from "../models/gameModel.js";
import User from "../models/userModel.js";
import GameReview from "../models/gameReviewModel.js";
import mongoose from "mongoose";
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
  // await gameReview.save();
  user.gameReviews.push(gameReview._id);
  await user.save();
  // const gamedata = gameRating.populate("game");
  // console.log(gameRating);
  await GameReview.populate(gameReview, "game");
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
  res.status(200).send({ _id });
});

// @desc   Get one game one's collection
// @route  GET /api/games/:_id
// @access Private
const getGame = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const gameReview = await GameReview.findOne({
    game: _id,
    user: userId,
  }).populate("game");
  if (!gameReview) {
    res.status(404);
    throw new Error("Game has not been added to collection");
  } else {
    res.status(200).json(gameReview);
  }
  // const user = await User.findById(req.user._id);
});

//@desc   Get all games from one's collection
//@route  GET /api/games
//@access Private
const getAllGames = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "gameReviews",
    populate: {
      path: "game",
      model: "Game",
    },
  });
  // console.log("getting All Games");
  res.status(200).json(user.gameReviews);
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
    if (rating.length === 1 && rating != "0") {
      rating += ".0";
    }
    if (rating.slice(-1) === ".") {
      rating += "0";
    }

    // const userId = new mongoose.Types.ObjectId(req.user._id);
    const gameReview = await GameReview.findOne({ _id: _id });
    if (!gameReview) {
      throw new Error("Game not added to collection");
    }
    gameReview.rating = rating;
    await gameReview.save();
    // res.status(200).send(gameRating);
    res.status(200).json(gameReview.rating);
  }
});

//@desc   Remove game to ones collection
//@route  PUT /api/games/review
//@access Private
const reviewGame = asyncHandler(async (req, res) => {
  const { _id, review } = req.body;
  const gameReview = await GameReview.findOne({ _id: _id });
  if (!gameReview) {
    throw new Error("Game not added to collection");
  }
  gameReview.review = review;
  await gameReview.save();
  res.status(200).json(gameReview.review);
});

export {
  searchGames,
  addGame,
  removeGame,
  getGame,
  getAllGames,
  rateGame,
  reviewGame,
};
