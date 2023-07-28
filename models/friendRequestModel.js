import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: false,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: false,
    },
  },
  {
    timestamps: true,
  }
);

friendRequestSchema.pre("save", async function (next) {
  if (this.sender.equals(this.receiver)) {
    next(new Error("Can not send a request to yourself"));
  }
  const checkFriendRequest = await FriendRequest.findOne({
    sender: this.receiver,
    receiver: this.sender,
  });
  if (checkFriendRequest) {
    // return Error("Can Not Send a Request to Yourself");
    next(
      new Error(
        "A friend request has already been sent to you. Please check your pending friend requests"
      )
    );
  }
  const checkFriendRequestExists = await FriendRequest.findOne({
    sender: this.sender,
    receiver: this.receiver,
  });
  if (checkFriendRequestExists) {
    next(new Error("The friend request has already been sent"));
  }
  next();
});

// friendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });
const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;
