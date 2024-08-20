const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");
const DishesController = require("../controllers/DishesController");
const DishImageController = require("../controllers/DishImageController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");
const verifyUserAuthorization = require("../middleware/verifyUserAuthorization");

const dishesController = new DishesController();
const dishImageController = new DishImageController();
const upload = multer(uploadConfig.MULTER);
const dishesRoutes = Router();

dishesRoutes.post(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization("admin"),
  dishesController.create
);

dishesRoutes.put(
  "/:id",
  ensureAuthenticated,
  verifyUserAuthorization("admin"),
  dishesController.update
);

dishesRoutes.get("/:id", ensureAuthenticated, dishesController.show);

dishesRoutes.get("/", ensureAuthenticated, dishesController.index);

dishesRoutes.delete(
  "/:id",
  ensureAuthenticated,
  verifyUserAuthorization("admin"),
  dishesController.delete
);

dishesRoutes.patch(
  "/:id/image",
  ensureAuthenticated,
  verifyUserAuthorization("admin"),
  upload.single("image"),
  dishImageController.update
);

module.exports = dishesRoutes;
