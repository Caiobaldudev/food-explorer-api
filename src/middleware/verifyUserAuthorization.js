const AppError = require("../utils/AppError");


function verifyUserAuthorization (roleToVerify) {
  return (req, res, next) => {
    const { role } = request.user;

    if(role !== roleToVerify){
      throw new AppError("Unauthorized", 401)
    }

    return next();
  }
}

module.exports = verifyUserAuthorization()
