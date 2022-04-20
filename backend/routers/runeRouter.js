import express from "express";
import RuneCollectors from "../models/runeModel.js";
import expressAsyncHandler from "express-async-handler";
import moment from "moment";

const runeRouter = express.Router();

const days = [10, 10, 10, 20, 20, 20, 50];

runeRouter.get(
  "/user/:id",
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const data = await RuneCollectors.findOne({ user: userId });
    if (data !== null) {
      if (
        !moment(data.lastCollected).isSame(
          moment.utc().subtract(1, "days"),
          "day"
        ) &&
        !moment(data.lastCollected).isSame(moment.utc(), "day")
      ) {
        data.daysInARow = 0;
      }
      await data.save();
      res.send(data);
    } else {
      const newUser = new RuneCollectors({
        user: userId,
        runes: 0,
        daysInARow: 0,
        lastCollected: "2022-01-01T01:00:00Z",
      });
      await newUser.save();
      res.send(newUser);
    }
  })
);

runeRouter.get(
  "/add/:id",
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const data = await RuneCollectors.findOne({ user: userId });
    if (
      !data.lastCollected ||
      !moment(data.lastCollected).isSame(moment.utc(), "day")
    ) {
      data.lastCollected = moment.utc().format();
      data.runes += days[data.daysInARow];

      if (data.daysInARow === 6) {
        data.daysInARow = 0;
      } else {
        data.daysInARow += 1;
      }
      await data.save();
    }
    res.send(data);
  })
);

export default runeRouter;
