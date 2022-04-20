import mongoose from "mongoose";

const runeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    runes: { type: Number, required: true },
    daysInARow: { type: Number, required: true },
    lastCollected: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const RuneCollectors = mongoose.model("RuneCollectors", runeSchema);

export default RuneCollectors;
