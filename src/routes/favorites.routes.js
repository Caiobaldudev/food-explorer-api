const { Router } = require("express");
const FavoriteController = require("../controllers/FavoriteController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const favoriteController = new FavoriteController();
const favoritesRoutes = Router();

favoritesRoutes.use(ensureAuthenticated); 

favoritesRoutes.post("/:dish_id", favoriteController.create);
favoritesRoutes.get("/", favoriteController.index);
favoritesRoutes.delete("/:dish_id", favoriteController.delete);

module.exports = favoritesRoutes;
