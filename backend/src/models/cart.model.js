const { Schema, Types, model } = require("mongoose");

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    cartItems: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        quantity: { type: Number, default: 0 },
        countInStock: { type: Number, required: true },
        price: { type: Number, default: 0 },
        image: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Cart", cartSchema);
