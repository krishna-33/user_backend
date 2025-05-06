const { sendSuccessRespose, sendErrorResponse } = require("../utils/response");
const userServices = require("../services/user.service");
const {
  USER_CREATED,
  SOMTHING_WENT_WRONG,
  USER_FOUND,
  USER_NOT_FOUND,
  USER_RETRIVED,
  NOT_AUTHERIZED,
  USER_DELETED,
  USER_ALREADY_REGISTERED,
} = require("../utils/message");
const { SUCCESS, ERROR, NOT_FOUND } = require("../utils/status");
const { sequelize } = require("../models");

module.exports = {
  getAllUsers: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { rows: users, count: total } = await userServices.getAllUsers(
        offset,
        limit,
        t
      );

      await t.commit();
      const totalPages = Math.ceil(total / limit);
      sendSuccessRespose(
        res,
        {
          users,
          pagination: {
            total,
            totalPages,
            currentPage: page,
            perPage: limit,
          },
        },
        USER_RETRIVED,
        SUCCESS
      );
    } catch (error) {
      console.log("error", error);
      await t.rollback();
      sendErrorResponse(res, SOMTHING_WENT_WRONG, ERROR);
    }
  },
  createUser: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const user = await userServices.getUser({ email: req.body.email }, t);
      if (user) {
        await t.rollback();
        return sendErrorResponse(res, USER_ALREADY_REGISTERED, ERROR);
      }

      let userObj = req.body;

      if (req.file) {
        userObj.profilePicture = `http://localhost:${process.env.SERVER_PORT}/uploads/${req.file.filename}`; // store relative path
      }

      const createdUser = await userServices.createUser(userObj, t);
      const {password, ...userData} = createdUser.dataValues
      await t.commit();
      sendSuccessRespose(res, userData, USER_CREATED, SUCCESS);
    } catch (error) {
      console.log("error", error);
      await t.rollback();
      sendErrorResponse(res, SOMTHING_WENT_WRONG, ERROR);
    }
  },
  getUserDetails: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const user = await userServices.getUser({ id: Number(id) }, t);
      if (!user) {
        await t.commit();
        return sendErrorResponse(res, USER_NOT_FOUND, NOT_FOUND);
      }
      const { password, ...userObj } = user;
      await t.commit();
      sendSuccessRespose(res, userObj, USER_FOUND, SUCCESS);
    } catch (error) {
      console.log("error", error);
      await t.rollback();
      sendErrorResponse(res, SOMTHING_WENT_WRONG, ERROR);
    }
  },
  updateUser: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const user = await userServices.getUser({ id: Number(id) }, t);
      if (!user) {
        await t.commit();
        return sendErrorResponse(res, USER_NOT_FOUND, NOT_FOUND);
      }

      const {email, ...updateData} = req.body;
      if (req.file) {
        updateData.profilePicture = `http://localhost:${process.env.SERVER_PORT}/uploads/${req.file.filename}`;
      }
      const updatedUser = await userServices.updateUser(id, updateData, t);

      if (!updatedUser) {
        await t.rollback();
        return sendErrorResponse(res, USER_NOT_FOUND, NOT_FOUND);
      }
      const { password, ...userObj } = updatedUser?.dataValues;
      await t.commit();
      sendSuccessRespose(
        res,
        userObj,
        "User updated successfully",
        SUCCESS
      );
    } catch (error) {
      console.log("error", error);
      await t.rollback();
      sendErrorResponse(res, SOMTHING_WENT_WRONG, ERROR);
    }
  },

  deleteUser: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const currentUser = req.user;

      if (currentUser.role !== "admin") {
        await t.rollback();
        return sendErrorResponse(res, NOT_AUTHERIZED, ERROR);
      }

      const deleted = await userServices.deleteUser(id, t);
      if (!deleted) {
        await t.rollback();
        return sendErrorResponse(res, USER_NOT_FOUND, NOT_FOUND);
      }

      await t.commit();
      sendSuccessRespose(res, {}, USER_DELETED, SUCCESS);
    } catch (error) {
      console.log("error", error);
      await t.rollback();
      sendErrorResponse(res, SOMTHING_WENT_WRONG, ERROR);
    }
  },
};
