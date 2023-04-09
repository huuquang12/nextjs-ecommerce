const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const RuneController = require("../controllers/rune.controller");

const runeRouter = express.Router();

runeRouter.get("/user/:id", asyncHandler(RuneController.getRune));

runeRouter.get("/add/:id", asyncHandler(RuneController.updateRune));

module.exports = runeRouter;
