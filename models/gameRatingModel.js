import mongoose from "mongoose";

const gameRatingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  game: {
    type: Number,
    required: true,
    ref: "Game",
  },
  rating: {
    type: Number,
  },
  comment: {
    type: String,
  },
});
gameRatingSchema.index({ user: 1 });
gameRatingSchema.index({ game: 1 });

// gameRatingSchema.pre("deleteOne", async function (next) {
//   const user = await mongoose.model("User").findOne({ gameRatings: this._id });
//   console.log(user);
//   if (user) {
//     // Remove the reference to the gameRating from the user's gameRatings array.
//     user.gameRatings.pull(this._id);
//     await user.save();
//   }
//   next();
// });
const gameRating = mongoose.model("GameRating", gameRatingSchema);
export default gameRating;
