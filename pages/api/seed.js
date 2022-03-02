import nc from "next-connect";
import Product from "../../models/Product";
import data from "../../utils/data";
import db from "../../utils/db";

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await db.disconnect();
  res.send({ message: "seed products successfully" });
});

export default handler;
