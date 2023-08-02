import mongoose from "mongoose";

const gameReviewSchema = new mongoose.Schema({
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
    type: String,
    default: "",
  },
  review: {
    type: String,
    default: "",
  },
});
gameReviewSchema.index({ user: 1 });
const gameRating = mongoose.model("GameReview", gameReviewSchema);
export default gameRating;
