const express = require('express');
const authMiddleWare = require('../../middleware/auth.middleware')
const userController = require('../../controllers/user.controller');
const router = express.Router();
const upload = require("../../utils/multer");
const authorizeRoleMiddleware = require('../../middleware/authorizeRole.middleware');

router.get('/', authMiddleWare, userController.getAllUsers)
      .post('/', authMiddleWare, authorizeRoleMiddleware('admin'), upload.single("profilePicture"), userController.createUser)
      .get('/:id',authMiddleWare, userController.getUserDetails)
      .patch('/:id', authMiddleWare, upload.single("profilePicture"), userController.updateUser)
      .delete('/:id',authMiddleWare, authorizeRoleMiddleware('admin'), userController.deleteUser)

module.exports = router;