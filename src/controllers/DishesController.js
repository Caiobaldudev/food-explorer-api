const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class DishesController {
  async create(req, res) {
    const { name, description, price, category, ingredients } = req.body;

    try {
      const checkDish = await knex("dishes").where("name", name).first();

      if (checkDish) {
        throw new AppError("Prato já cadastrado!", 409);
      }

      const [dish_id] = await knex("dishes").insert({
        name,
        description,
        price: parseFloat(price),
        category,
      });

      const insertIngredients = ingredients.map((ingredient) => ({
        dish_id,
        name: ingredient,
      }));
      await knex("ingredients").insert(insertIngredients);

      return res
        .status(201)
        .json({ message: "O prato foi cadastrado com sucesso!", id: dish_id });
    } catch (error) {
      console.error("Erro ao criar prato:", error);
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || "Erro interno do servidor" });
    }
  }

  async update(req, res) {
    const { name, description, image_id, price, category, ingredients } =
      req.body;
    const { id: dish_id } = req.params;

    try {
      const dish = await knex("dishes").where({ id: dish_id }).first();
      if (!dish) {
        throw new AppError("Prato não encontrado", 404);
      }

      const updatedData = {
        name,
        description,
        price: parseFloat(price),
        category,
      };

      if (image_id) {
        updatedData.image_id = image_id;
      }

      await knex("dishes").where({ id: dish_id }).update(updatedData);

      await knex("ingredients").where({ dish_id }).del();

      const newIngredients = ingredients.map((ingredient) => ({
        dish_id,
        name: ingredient,
      }));

      await knex("ingredients").insert(newIngredients);

      return res.status(201).json({ message: "Prato atualizado!" });
    } catch (error) {
      console.error("Erro ao atualizar prato:", error);
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || "Erro interno do servidor" });
    }
  }

  async show(req, res) {
    const { id } = req.params;
    try {
      const dish = await knex("dishes").where("id", id).first();
      if (!dish) {
        throw new AppError("Prato não encontrado", 404);
      }
      const ingredients = await knex("ingredients").where("dish_id", id);
      const dishesWithIngredients = {
        ...dish,
        ingredients,
        price: dish.price.toFixed(2).replace(".", ","),
      };
      return res.status(200).json(dishesWithIngredients);
    } catch (error) {
      console.error("Erro ao buscar prato:", error);
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || "Erro interno do servidor" });
    }
  }

  async index(req, res) {
    const { search } = req.query;

    try {
      let dishesQuery = knex("dishes")
        .select([
          "dishes.id",
          "dishes.name",
          "dishes.price",
          "dishes.description",
          "dishes.image_id",
          "dishes.category",
          "dishes.created_at",
        ])
        .distinct()
        .orderBy("dishes.name");

      if (search) {
        dishesQuery = dishesQuery
          .join("ingredients", "dishes.id", "=", "ingredients.dish_id")
          .where("dishes.name", "like", `%${search}%`)
          .orWhere("ingredients.name", "like", `%${search}%`);
      }

      let dishes = await dishesQuery;

      dishes = dishes.map((dish) => ({
        ...dish,
        price: parseFloat(dish.price).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      }));

      return res.status(200).json(dishes);
    } catch (error) {
      console.error("Erro ao buscar pratos:", error);
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || "Erro interno do servidor" });
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      const dish = await knex("dishes").where({ id }).first();
      if (!dish) {
        throw new AppError("Prato não encontrado", 404);
      }

      await knex("dishes").where({ id }).delete();
      return res.status(202).json({ message: "O prato foi excluído!" });
    } catch (error) {
      console.error("Erro ao excluir prato:", error);
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || "Erro interno do servidor" });
    }
  }
}

module.exports = DishesController;
