const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  chw_id: Number,
  phone: { type: String, unique: true },
  password: String,
  chw_address: String,
  chw_name: String,
  image: String,
  chw_dob: String,
  chw_gender: String,
  chw_designation: String,
});
/*-------------------------
 hash the password before
 creating the current user 
 --------------------------*/
userSchema.pre("save", function (next) {
  const user = this;
  // check if the new user is created by checking if the new password is created
  if (!user.isModified("password")) {
    return next();
  }
  // create salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    // hash the password using the user password and the salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

mongoose.model("User", userSchema);
