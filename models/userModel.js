const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role :{
    type : String,
    required:true
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }

})

// static signup method
userSchema.statics.signup = async function(email, password, role) {
  try {
    // Validation
    if (!email || !password || !role) {
      throw new Error('All fields must be filled');
    }


    // Check if email already exists
    const existingUser = await this.findOne({ email });
    if (existingUser) {
      throw new Error('Username Id already in use');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create the user
    const user = await this.create({ email, password: hash, role });

    return user;
  } catch (error) {
    throw error; // Re-throw the error for consistent error handling
  }
}
// static login method
userSchema.statics.login = async function(email, password) {
  try {
    if (!email || !password) {
      throw new Error('All fields must be filled');
    }

    const user = await this.findOne({ email });

    if (!user) {
      throw new Error('Incorrect email');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      // Incorrect password attempt
      user.loginAttempts += 1;
      await user.save();

      if (user.loginAttempts >= 3) {
        user.active = false;
        await user.save();
        throw new Error('Account inactive. Too many incorrect login attempts.');
      }

      throw new Error('Incorrect password');
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    await user.save();

    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('User', userSchema)