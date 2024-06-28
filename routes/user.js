const express = require('express')

// controller functions
const { loginUser, signupUser,activateUser } = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// make activation
router.post('/users', activateUser);

// signup route
router.post('/signup', signupUser)

module.exports = router