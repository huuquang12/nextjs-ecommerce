const express = require("express");
const router = express.Router();

router.use("/api/users", require("./user.route"));
router.use("/api/products", require("./product.route"));
router.use("/api/carts", require("./cart.route"));
router.use("/api/orders", require("./order.route"));
router.use("/api/admin", require("./admin.route"));
router.use("/api/keys", require("./key.route"));
router.use("/api/runes", require("./rune.route"));
module.exports = router;
