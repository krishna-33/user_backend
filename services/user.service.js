const { users: Users } = require("../models");

module.exports = {
  getAllUsers: async (offset, limit, t) => {
    const users = await Users.findAndCountAll({
      offset,
      limit,
      t,
      order: [["updatedAt", "DESC"]],
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"]
      },
    });

    return users;
  },
  createUser: async (userObj, t) => {
    const userCreated = await Users.create(userObj, {
      transaction: t,
    });

    return userCreated;
  },

  getUserById: async (userId, t) => {
    const userObj = await Users.findOne(
      {
        raw: true,
        where: {
          id: Number(userId),
        },
      },
      { transaction: t }
    );

    return userObj;
  },
  getUser: async (userobj, t) => {
    const userFounded = await Users.findOne(
      {
        raw: true,
        where: userobj,
      },
      { transaction: t }
    );

    return userFounded;
  },
  updateUser: async (userId, userObj, t) => {
    const [affectedRows] = await Users.update(userObj, {
      where: { id: Number(userId) },
      transaction: t,
    });

    if (affectedRows === 0) return null;

    const updatedUser = await Users.findOne({
      where: { id: Number(userId) },
      transaction: t,
    });

    return updatedUser;
  },
  deleteUser: async (userId, t) => {
    const deleteUser = await Users.destroy({
      where: { id: Number(userId) },
      transaction: t,
    });
    return deleteUser;
  },
};
