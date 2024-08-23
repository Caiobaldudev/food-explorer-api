const AppError = require("../utils/AppError");

function verifyUserAuthorization(roleToVerify) {
  return (req, res, next) => {
    const { role } = req.user;
    const validRoles = ["admin", "user"];

    if (role !== roleToVerify) {
      throw new AppError("Unauthorized", 401);
    }

    if (!validRoles.includes(roleToVerify)) {
      throw new AppError("Role not recognized", 400);
    }

    return next();
  };
}

module.exports = verifyUserAuthorization;
