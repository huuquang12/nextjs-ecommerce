const { Schema, Types, model } = require("mongoose");

const runeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    runes: { type: Number, required: true },
    daysInARow: { type: Number, required: true },
    lastCollected: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = model("RuneCollectors", runeSchema);
