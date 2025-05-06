const jwt = require("jsonwebtoken");
const { users: Users } = require("../models");
const { NO_ACCESS, USER_NOT_FOUND, INVALID_TOKEN } = require("../utils/message");
const { sendErrorResponse } = require("../utils/response");
const { ERROR, UNAUTHORIZED } = require("../utils/status");


module.exports = async (req, res, next) => {
  const token = req.header("Authorization").split(' ')[1];
  
  if (!token) {
    return sendErrorResponse(res, NO_ACCESS, ERROR);
  } else {

    const decodeTooken = jwt.decode(token, process.env.JWT_SECRET_KEY);

    if (decodeTooken?.id) {
      const user = await Users.findOne({
        raw: true,
        where: {id: decodeTooken?.id}
      });
      if (!user) {
        return sendErrorResponse(res, USER_NOT_FOUND, UNAUTHORIZED);
      }
      else{
        req.user = user
        next()
      }
    } else {
          return sendErrorResponse(res, INVALID_TOKEN, UNAUTHORIZED);
    }
  }
};