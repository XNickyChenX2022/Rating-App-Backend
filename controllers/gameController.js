import asyncHandler from "express-async-handler";
import Games from "../models/gameModel.js";
import User from "../models/userModel.js";
//@desc   Search database for games
//@route  POST /api/games/search
//@access Private
const searchGames = asyncHandler(async (req, res) => {
  try {
    const { search } = req.body;
    const games = await Games.find({
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
//@route  POST /api/games/add
//@access Private
const addGame = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(req.user._id);
  } catch (error) {}
});

//@desc   Remove game to ones collection
//@route  DELETE /api/games/delete
//@access Private
const removeGame = asyncHandler(async (req, res) => {});

//@desc   Remove game to ones collection
//@route  POST /api/games/rate
//@access Private
const rateGame = asyncHandler(async (req, res) => {});

//@desc   Remove game to ones collection
//@route  PUT /api/games/rate
//@access Private
const updateRating = asyncHandler(async (req, res) => {});

//@desc   Remove game to ones collection
//@route  POST /api/games/comment
//@access Private
const commentGame = asyncHandler(async (req, res) => {});

export { searchGames, addGame, removeGame, rateGame, commentGame };
