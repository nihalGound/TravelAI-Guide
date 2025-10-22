import mongoose, { Schema } from "mongoose";

const SuggestedGuideSchema = new Schema({
  city: { type: String, required: true },
  image: { type: String, required: true },
  activities: [{ type: String }],
  details: [{ type: String }],
});

export default mongoose.models.SuggestedGuide ||
  mongoose.model("SuggestedGuide", SuggestedGuideSchema);
