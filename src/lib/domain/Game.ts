import mongoose, { Schema } from "mongoose";

const GameSchema = new Schema({
  away_id: { type: String, required: true },
  home_id: { type: String, required: true },
  season: { type: String, required: true },
  gameweek: { type: Number, required: true },
});

export default mongoose.models.Game || mongoose.model("Game", GameSchema);
