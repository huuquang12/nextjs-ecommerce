import express from "express";
import { isAuth } from "../utils.js";

const keyRouter = express.Router();

keyRouter.get("/paypal", isAuth, async (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

keyRouter.get("/google", isAuth, async (req, res) => {
  res.send(process.env.GOOGLE_API_KEY || "nokey");
});
export default keyRouter;
