const { NOT_AUTHERIZED } = require("../utils/message");
const { sendErrorResponse } = require("../utils/response");
const { FORBIDDEN } = require("../utils/status");

module.exports =  authorizeRole = (role) => {
    return (req, res, next) => {
      if (!req.user || req.user.role !== role) {
        return sendErrorResponse(res, NOT_AUTHERIZED, FORBIDDEN);
      }
      next();
    };
  };
  