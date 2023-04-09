const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { isAuth, isAdmin } = require("../utils/auth");
const multer = require("multer");
const adminController = require("../controllers/admin.controller");

const adminRouter = express.Router();
const upload = multer();

const config = {
  api: {
    bodyParser: false,
  },
};

adminRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  asyncHandler(adminController.getSummary)
);

adminRouter.get(
  "/orders",
  isAuth,
  isAdmin,
  asyncHandler(adminController.getAllOrders)
);

adminRouter.get(
  "/products",
  isAuth,
  isAdmin,
  asyncHandler(adminController.getAllProducts)
);

adminRouter.put(
  "/products/:id",
  isAuth,
  isAdmin,
  asyncHandler(adminController.updateProductById)
);

adminRouter.get(
  "/products/:id",
  isAuth,
  isAdmin,
  asyncHandler(adminController.getProductById)
);

adminRouter.post(
  "/upload",
  isAuth,
  isAdmin,
  upload.single("file"),
  asyncHandler(adminController.uploadProduct)
);

adminRouter.post(
  "/products",
  isAuth,
  isAdmin,
  asyncHandler(adminController.createProduct)
);

adminRouter.get(
  "/users",
  isAuth,
  isAdmin,
  asyncHandler(adminController.getAllUsers)
);

adminRouter.delete(
  "/products/:id",
  isAuth,
  isAdmin,
  asyncHandler(adminController.deleteProductById)
);

adminRouter.get(
  "/users/:id",
  isAuth,
  isAdmin,
  asyncHandler(adminController.getUserById)
);

adminRouter.delete(
  "/users/:id",
  isAuth,
  isAdmin,
  asyncHandler(adminController.deleteUserById)
);

adminRouter.put(
  "/users/:id",
  isAuth,
  isAdmin,
  asyncHandler(adminController.updateRoleUser)
);

module.exports = adminRouter;
