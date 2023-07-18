import mongoose from "mongoose";

const GameSchema = mongoose.Schema({
  id: { type: Number },
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

const Game = mongoose.model("Game", GameSchema);
export default Game;
