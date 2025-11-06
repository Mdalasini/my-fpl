import mongoose, { Schema } from "mongoose";

const TeamLogoSchema = new Schema({
  team_id: { type: String, required: true, unique: true },
  logo_path: { type: String, required: true },
});

export default mongoose.models.TeamLogo ||
  mongoose.model("TeamLogo", TeamLogoSchema);
