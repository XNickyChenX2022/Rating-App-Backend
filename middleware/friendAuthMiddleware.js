import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protectFriend = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findById(req.user._id);
  await User.populate(user, "friends");
  const check = user.friends.find((friend) => friend.username === username);
  if (check) {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized to access Friend's list");
  }
});

export { protectFriend };
