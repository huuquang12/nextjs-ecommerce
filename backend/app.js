import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
import cors from "cors";
import bodyParser from "body-parser";
("body-parser");

mongoose.connect(
  process.env.MONGODB_URL || "mongodb://localhost/nextjs-ecommerce",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";
import keyRouter from "./routers/keyRouter.js";
import adminRouter from "./routers/adminRouter.js";

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/keys", keyRouter);
app.use("/api/admin", adminRouter);
// app.use('/api/uploads', uploadRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.get("/", (req, res) => {
  res.send("Server is ready");
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
