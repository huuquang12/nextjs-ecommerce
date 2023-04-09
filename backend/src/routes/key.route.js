const { isAuth } = require("../utils/auth");
const express = require("express");

const keyRouter = express.Router();

keyRouter.get("/paypal", isAuth, async (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

// keyRouter.get("/google", isAuth, async (req, res) => {
//   res.send(process.env.GOOGLE_API_KEY || "nokey");
// });

module.exports = keyRouter;
