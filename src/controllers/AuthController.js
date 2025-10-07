const authConfig = require("../config/auth.js");
const { User } = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signIn = require("../handlers/singIn.js");
const signUp = require("../handlers/signUp.js");
const signUpAdmin = require("../handlers/signUpAdmin.js");
const firstSignUpAdmin = require("../handlers/firstSignUpAdmin.js");
const forgotPassword = require('../handlers/forgotPassword.js');
const resetPassword = require('../handlers/resetPassword.js');


module.exports = {
  signIn,
  signUp,
  signUpAdmin,
  firstSignUpAdmin,
  forgotPassword, 
  resetPassword  
};