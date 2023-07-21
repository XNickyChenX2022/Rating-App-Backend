import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
  _id: { type: Number },
  cover: {
    id: Number,
    image_id: String,
  },
  dlcs: [
    {
      id: Number,
      name: String,
    },
  ],
  expansions: [
    {
      id: Number,
      name: String,
    },
  ],
  involved_companies: [
    {
      id: Number,
      company: {
        id: Number,
        name: String,
      },
      developer: Boolean,
      publisher: Boolean,
    },
  ],
  name: String,
  platforms: [
    {
      id: Number,
      name: String,
    },
  ],
  remakes: [
    {
      id: Number,
      name: String,
    },
  ],
  remasters: [
    {
      id: Number,
      name: String,
    },
  ],
});
GameSchema.index({ name: 1 });
const Game = mongoose.model("Game", GameSchema);
export default Game;
