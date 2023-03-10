const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse } = require("../utils/jwt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const path = require('path');

//register
const register = async (req, res) => {
  const { email, name, password } = req.body;
  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists && emailAlreadyExists.isVerified) {
    // throw new CustomError.BadRequestError("Email already exists");


   return res
    .status(StatusCodes.CREATED)
      .json({
        msg: "Error: email already exists",
        errorCode:409
        
      });
  }

  if (emailAlreadyExists && !emailAlreadyExists.isVerified) {
    await User.deleteOne({ email });
  }
  

    const isFirstUser = (await User.countDocuments({})) === 0;
  const role = isFirstUser ? "admin" : "user";

  var verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await User.create({
    email,
    name,
    password,
    role,
    verificationToken,
  });



  ///////////////////////////////////////////////////////////////////
  
// sendEmail(email, verificationToken);
  
  
//////////////////////////////////////////////////////////////////

  //send verification token temporary for postman
  return res
    .status(StatusCodes.CREATED)
    .json({
      // msg: "please check your registered email for verification",
      msg:`http://localhost:5000/api/v1/auth/verify-email?verificationToken=${verificationToken}&email=${email}`,
      errorCode:201
      /*, token: verificationToken */
});

  //   const tokenUser = { name: user.name, userId: user._id, role: user.role };
  //   attachCookiesToResponse({ res, user: tokenUser });

  //   res.status(StatusCodes.CREATED).json({ user: tokenUser });





};

const verifyEmail = async (req, res) => {
    const { verificationToken, email } = req.query;
    const user = await User.findOne({ email });
    if (!user) {
      return res.sendFile(__dirname+"/emailNotVerified.html");
    }

    if (user.verificationToken !== verificationToken) { 
      return res.sendFile(__dirname+"/emailNotVerified.html");
    }

    user.isVerified = true;
    user.verified = Date.now();
    user.verificationToken = '';
    await user.save();
    
    return res.sendFile(__dirname+"/emailVerified.html");
};

//login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
    .status(StatusCodes.CREATED)
      .json({
        msg: "Error:Please enter all fields",
        errorCode:400
        
});
  }

    const user = await User.findOne({ email });


  if (!user) {
    return res
    .status(StatusCodes.CREATED)
      .json({
        msg: "Error:Invalid Credentials",
        errorCode:401
        
});
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return res
    .status(StatusCodes.CREATED)
      .json({
        msg: "Error:Invalid Credentials",
        errorCode:401
        
});
  }

  if (!user.isVerified) {
    return res
    .status(StatusCodes.CREATED)
      .json({
        msg: "Error: Please verify your email",
        errorCode:401
        
});
  }

  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  attachCookiesToResponse({ res, user: tokenUser });
  const userData={name:user.name,role:user.role,email:user.email}
  return res
    .status(StatusCodes.CREATED)
      .json({
        msg: "Login Successful, Welcome",
        errorCode: 200,
        data:userData
});
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  return res.status(StatusCodes.OK).json({ msg: "Logout successful" });
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
};
