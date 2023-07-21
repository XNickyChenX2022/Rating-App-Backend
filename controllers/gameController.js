import asyncHandler from "express-async-handler";
import Game from "../models/gameModel.js";
import User from "../models/userModel.js";
import GameRating from "../models/gameRatingModel.js";
import mongoose from "mongoose";
//@desc   Search database for games
//@route  POST /api/games/search
//@access Private
const searchGames = asyncHandler(async (req, res) => {
  try {
    const { search } = req.body;
    const games = await Game.find({
      name: { $regex: `^${search}`, $options: "i" },
    })
      .hint({ name: 1 })
      .limit(24);
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
  try {
    const { _id } = req.body;
    const user = await User.findById(req.user._id);
    const checkgameRating = await GameRating.findOne({
      user: user._id,
      game: _id,
    });
    if (checkgameRating != null) {
      res.status(401);
      throw new Error(`Game has already been added ${checkgameRating}`);
    }
    const gameRating = await GameRating.create({
      user: user._id,
      game: _id,
    });
    user.gameRatings.push(gameRating._id);
    await user.save();
    res.status(200).send("added game");
  } catch (error) {
    res.status(401);
    throw new Error("Unable to add game");
  }
});

//@desc   Remove game to ones collection
//@route  DELETE /api/games
//@access Private
const removeGame = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.body;
    const user = await User.findById(req.user._id);
    const gameRating = await GameRating.findOne({ game: _id, user: user.id });
    if (gameRating == null) {
      res.status(404);
      throw new Error("game not found");
    }
    await GameRating.deleteOne({ _id: gameRating.id });
    await User.findOneAndUpdate(
      { _id: user.id },
      { $pull: { gameRatings: gameRating.id } }
    );
    res.status(200).send("Deleted Game");
  } catch (error) {
    res.status(401);
    throw new Error(`Unable to delete added game ${error}`);
  }
});

// @desc   Get one game one's collection
// @route  GET /api/games/:_id
// @access Private
const getGame = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const gameRating = await GameRating.findOne({
    game: _id,
    user: userId,
  }).populate("game");
  if (!gameRating) {
    res.status(404);
    throw new Error("Game has not been added to collection");
  }
  res.status(200).json(gameRating);
  // const user = await User.findById(req.user._id);
});

//@desc   Get all games from one's collection
//@route  GET /api/games
//@access Private
const getAllGames = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "gameRatings",
    populate: {
      path: "game",
      model: "Game",
    },
  });
  if (user == null) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});
//@desc   Rate game to ones collection
//@route  PUT /api/games/rate
//@access Private
const rateGame = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.body;
    const { rating } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const gameRating = await GameRating.findOne({ game: _id, user: userId });
    gameRating.rating = rating;
    await gameRating.save();
    res.status(200).send(gameRating);
  } catch (error) {
    res.status(400);
    throw new Error(`not valid rating`);
  }
});

//@desc   Remove game to ones collection
//@route  PUT /api/games/comment
//@access Private
const commentGame = asyncHandler(async (req, res) => {});

export {
  searchGames,
  addGame,
  removeGame,
  getGame,
  getAllGames,
  rateGame,
  commentGame,
};
