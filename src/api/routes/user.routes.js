const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Public routes
router.get('/', userController.getAllUsers);
router.get('/id/:id', userController.getUserById);
router.get('/name/:name', userController.getUserByName); 
router.patch('/update-role/:id/:role',userController.patchUserRole);
router.post('/post-user',userController.postNewUser);

module.exports = router; 
