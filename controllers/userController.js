const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Attempt to login the user
    const user = await User.login(email, password);

    // Create a token
    const token = createToken(user._id);

    // Fetch user role from database
    const userWithRole = await User.findOne({ email }, 'role');

    // Respond with email, token, and role
    res.status(200).json({
      email,
      token,
      role: userWithRole.role // Include the role in the response
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup a user
const signupUser = async (req, res) => {
  const {email, password,role} = req.body

  try {
    const user = await User.signup(email, password,role)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

module.exports = { signupUser, loginUser }