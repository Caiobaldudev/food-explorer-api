const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");

class DishesImageController {
  async update(req, res) {
    const { id } = req.params;
    const imageFilename = req.file.filename;

    const diskStorage = new DiskStorage();

    const dish = await knex("dishes").where({ id }).first();

    if (!dish) {
      throw new AppError("Prato não encontrado!", 404);
    }

    if (dish.image_id) {
      await diskStorage.deleteFile(dish.image_id);
    }

    const filename = await diskStorage.saveFile(imageFilename);

    dish.image_id = filename;

    await knex("dishes").update(dish).where({ id });

    return res.json(dish);
  }
}

module.exports = DishesImageController;
