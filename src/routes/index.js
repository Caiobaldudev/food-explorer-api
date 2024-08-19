const { Router } = require("express")

const usersRouter = require("./users.routes.js")
const sessionsRouter = require("./sessions.routes.js")

const routes = Router()

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);

module.exports = routes