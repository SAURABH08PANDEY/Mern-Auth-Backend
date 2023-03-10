const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minLength: 6,
    maxLength: 100,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
});

UserSchema.pre("save", async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  const ans = await bcrypt.hash(this.password, salt);
  this.password = ans;
});


UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);  
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
