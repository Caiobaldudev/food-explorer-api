const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError.js");
const knex = require("../database/knex");

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    const existingUsers = await knex("users").count("id as count");
    const isFirstUser = existingUsers[0].count === 0;

    const checkUserExists = await knex("users").where({ email });

    if (checkUserExists.length > 0) {
      throw new AppError("Este e-mail já está em uso!");
    }

    const hashedPassword = await hash(password, 8);

    const role = isFirstUser ? "admin" : "customer";

    await knex("users").insert({ name, email, password: hashedPassword, role });

    return res.status(201).json();
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body;
    const user_id = req.user.id

    const [user] = await knex("users").where({ id: user_id });

    if (!user) {
      throw new AppError("Usuário não encontrado!");
    }

    const [userWithUpdatedEmail] = await knex("users").where({ email });

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este email já está em uso!");
    }

    const updatedUser = {
      name: name ?? user.name,
      email: email ?? user.email,
    };

    if (password) {
      if (!old_password) {
        throw new AppError("Você precisa informar a senha antiga para definir a nova senha!");
      }

      const checkOldPassword = await compare(old_password, user.password);
      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere!");
      }
  
      updatedUser.password = await hash(password, 8);
    }

    await knex('users')
    .update({
      ...updatedUser,
      updated_at: knex.fn.now(),
    })
    .where({ id: user_id });

    return res.status(200).json();
  }
}
module.exports = UsersController;
