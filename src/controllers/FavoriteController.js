const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class FavoriteController {
  async create(req, res) {
    const { dish_id } = req.params;
    const user_id = req.user.id;

    try {
      const favoriteExists = await knex("favorites").select("id").where({ user_id, dish_id }).first();

      if (favoriteExists) {
        throw new AppError("Prato já é favorito", 400);
      }

      await knex("favorites").insert({ user_id, dish_id });

      return res.status(200).json({ message: "Prato adicionado aos favoritos" });
    } catch (error) {
      throw new AppError("Erro interno do servidor", 500);
    }
  }

  async index(req, res) {
    const user_id = req.user.id;
  
    try {
      const favoritesDishes = await knex("favorites")
        .where({ user_id })
        .join("dishes", "favorites.dish_id", "=", "dishes.id")
        .select("dishes.name", "dishes.id", "dishes.image_id", "dishes.price")
        .orderBy("name");
  
      if (!favoritesDishes.length) {
        return res.status(200).json({ message: "Não há pratos favoritos!" });
      } else {
        return res.status(200).json(favoritesDishes);
      }
    } catch (error) {
      console.error("Error fetching favorite dishes:", error);
      throw new AppError("Erro interno do servidor", 500);
    }
  }

  async delete(req, res) {
    const { dish_id } = req.params;
    const user_id = req.user.id;

    try {
      const deleted = await knex("favorites").where({ user_id, dish_id }).del();

      if (!deleted) {
        throw new AppError("Prato favorito não encontrado", 404);
      }

      return res.status(200).json({ message: "Prato removido dos favoritos!" });
    } catch (error) {
      throw new AppError("Erro interno do servidor", 500);
    }
  }
}

module.exports = FavoriteController;
