const {
  SOMTHING_WENT_WRONG,
  USER_LOGIN,
  USER_NOT_FOUND,
  USER_SIGNUP,
  USER_ALREADY_REGISTERED,
  WRONG_PASSWORD,
  INVALID_CREDENTIALS,
} = require("../utils/message");
const { ERROR, SUCCESS, NOT_FOUND } = require("../utils/status");
const { sequelize } = require("../models");
const { sendErrorResponse, sendSuccessRespose } = require("../utils/response");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userService = require("../services/user.service");

module.exports = {
  logIn: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const user = await userService.getUser({ email: req.body.email }, t);
      if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        await t.rollback();
        return sendErrorResponse(res, INVALID_CREDENTIALS, NOT_FOUND);
      }
      const token = jwt.sign({ id: user?.id }, process.env.JWT_SECRET_KEY);
      const { password, ...userObj } = user;
      await t.commit();

      sendSuccessRespose(res, {...userObj, token }, USER_LOGIN, SUCCESS);
    } catch (error) {
      console.log("error", error);
      await t.rollback();
      sendErrorResponse(res, SOMTHING_WENT_WRONG, ERROR);
    }
  },
};
