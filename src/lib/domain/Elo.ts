import mongoose, { Schema } from "mongoose";

const EloSchema = new Schema({
  team_id: { type: String, required: true, unique: true },
  off_elo: { type: Number, required: true },
  def_elo: { type: Number, required: true },
});

export default mongoose.models.Elo || mongoose.model("Elo", EloSchema);
