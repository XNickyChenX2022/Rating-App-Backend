import AsyncHandler from "express-async-handler";
import FriendRequest from "../models/friendRequestModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import { connectRedis } from "../config/client.js";
let client = connectRedis();
//@desc     Send Friend Request
//@route    POST /api/friends
//@route    private
const sendFriendRequest = AsyncHandler(async (req, res) => {
  const { receiverName } = req.body;
  const sender = await User.findById(req.user._id);
  const receiver = await User.findOne({ username: receiverName });
  sender.friends.forEach((friend) => {
    if (friend.equals(receiver._id)) {
      res.status(400);
      throw new Error("Already a friend");
    }
  });
  if (!sender) {
    res.status(404);
    throw new Error("Not valid sender");
  } else if (!receiver) {
    res.status(404);
    throw new Error("The user you're sending to does not exist");
  } else {
    await FriendRequest.create({
      sender: sender._id,
      receiver: receiver._id,
    });
    res.status(200).json({ message: `Friend request sent to ${receiverName}` });
  }
});

//@desc     Respond (accept => true/reject => false) to friend request
//@method   POST /api/friends/respond
//@access   private
const respondFriendRequest = AsyncHandler(async (req, res) => {
  const { response, senderUsername } = req.body;
  const receiver = await User.findById(req.user._id);
  const sender = await User.findOne({ username: senderUsername });
  if (!sender) {
    res.status(404);
    throw new Error("Sender not found");
  }
  const friendRequest = await FriendRequest.findOne({
    sender: sender._id,
    receiver: receiver._id,
  });
  if (!friendRequest) {
    res.status(400);
    throw new Error("Friend Request does not exists");
  } else {
    if (response === true) {
      receiver.friends.push(sender._id);
      sender.friends.push(receiver._id);
      receiver.save();
      sender.save();
      await FriendRequest.deleteOne({ _id: friendRequest._id });
      res.status(200).json(sender);
    } else {
      await FriendRequest.deleteOne({ _id: friendRequest._id });
      res.status(200).json({ message: "Cancelled friend request" });
    }
  }
});

//@desc       Get a list of all friend requests sent to you
//@route      GET /api/friends/requests
//@access     Private
const getAllFriendRequests = AsyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const friendRequests = await FriendRequest.find({
    receiver: userId,
  }).populate({ path: "sender", select: "username" });
  res.status(200).send(friendRequests);
});

//@desc       Get a list of all your friends
//@route      GET /api/friends/
//@access     Private
const getAllFriends = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  await User.populate(user, "friends");
  res.status(200).json(user.friends);
});

//@desc       Get a list of a friend's game
//@route      GET /api/friends/:username
//@access     Private
const getFriendGames = AsyncHandler(async (req, res) => {
  const { username } = req.params;
  console.log(username);
  const user = await User.findOne({ username: "testtest" });
  console.log(user);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  let cachedData = await client.hGetAll(`user:${user._id}:gameReviews`);
  if (cachedData && cachedData && Object.keys(cachedData).length > 0) {
    const jsonArray = Object.values(cachedData).map((jsonString) =>
      JSON.parse(jsonString)
    );
    res.status(200).json(jsonArray);
  } else {
    const user = await User.findOne({ username: username }).populate({
      path: "gameReviews",
      populate: {
        path: "game",
        model: "Game",
      },
    });
    res
      .status(200)
      .json({ username: user.username, gameReviews: user.gameReviews });
  }
});

export {
  sendFriendRequest,
  respondFriendRequest,
  getAllFriendRequests,
  getAllFriends,
  getFriendGames,
};
