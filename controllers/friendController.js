import AsyncHandler from "express-async-handler";
import FriendRequest from "../models/friendRequestModel.js";
import User from "../models/userModel.js";

//@desc     Send Friend Request
//@route    POST /api/friends
//@route    private
const sendFriendRequest = AsyncHandler(async (req, res, next) => {
  const { receiverName } = req.body;
  const sender = await User.findById(req.user._id);
  const receiver = await User.findOne({ username: receiverName });
  if (!sender) {
    res.status(404);
    throw new Error("Not valid sender");
  } else if (!receiver) {
    res.status(404);
    throw new Error("The user your sending to does not exists");
  } else {
    await FriendRequest.create({
      sender: sender._id,
      receiver: receiver._id,
    });
    res.status(200).send(`Friend request sent to ${receiverName}`);
  }
});

//@desc     Respond (accept => true/reject => false) to friend request
//@method   POST /api/friends/respond
//@access   private
const respondFriendRequest = AsyncHandler(async (req, res) => {
  const { response, senderUsername } = req.body;
  console.log(response);
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
  console.log(friendRequest);
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
      res.status(200).send({ message: "Successfully added friend" });
    } else {
      await FriendRequest.deleteOne({ _id: friendRequest._id });
      res.status(200).json({ message: "Cancelled friend request" });
    }
  }
});

//@desc       Get a list of all your friends
//@route      GET /api/friends
//@access     Private
const getAllFriends = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  await User.populate(user, "friends");
  res.status(200).json(user.friends);
});

export { sendFriendRequest, respondFriendRequest, getAllFriends };
