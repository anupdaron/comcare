const express = require("express");
const AuthRouter = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

// user register
AuthRouter.post("/api/addUser", async (req, res) => {
  const { phone, password } = req.body;
  User.find().then((result) => {
    if (result.length > 0) {
      createUser(req, res, phone, password, result.length + 1);
    } else {
      createUser(req, res, phone, password, 1);
    }
  });
});
const createUser = (req, res, phone, password, user_id) => {
  const user = new User({
    user_id,
    phone,
    password,
    address: "",
    name: "",
    image: "",
    dob: "",
    gender: "",
    designation: "",
  });
  user
    .save()
    .then((result) => {
      res.status(201).json({
        id: result.user_id,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error" });
    });
};

AuthRouter.post("/api/loginUser", async (req, res) => {
  const { phone, password } = req.body;
  User.findOne({ phone }).then((user) => {
    //if user not exist than return status 400
    if (!user) return res.status(400).json({ error: "Invalid Credentials" });

    bcrypt.compare(password, user.password, (err, data) => {
      //if error than throw error
      if (err) throw err;

      //if both match than you can do anything
      if (data) {
        User.find({ phone }).then((result) => {
          if (result.length > 0) {
            res.status(200).json({ user_id: result[0].user_id });
          } else {
            res.status(400).json({ msg: "user does not exist" });
          }
        });
      } else {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    });
  });
});

module.exports = AuthRouter;
