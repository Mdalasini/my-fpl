import mongoose, { Schema } from "mongoose";

const TeamSchema = new Schema({
  team_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  short_name: { type: String, required: true },
});

export default mongoose.models.Team || mongoose.model("Team", TeamSchema);
