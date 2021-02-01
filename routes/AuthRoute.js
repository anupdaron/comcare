const express = require("express");
const AuthRouter = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const DIR = "./public/";

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
        code: "200",
        status: "Success",
        details: { user_id: result.user_id },
        message: "User Created Successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        code: "500",
        status: "Failure",
        details: {},
        message: "Internal Server Error",
      });
    });
};

AuthRouter.post("/api/loginUser", async (req, res) => {
  const { phone, password } = req.body;

  User.findOne({ phone }).then((user) => {
    //if user not exist than return status 400
    if (!user)
      return res.status(400).json({
        code: "400",
        status: "Failure",
        details: {},
        message: "User not found",
      });

    bcrypt.compare(password, user.password, (err, data) => {
      //if error than throw error
      if (err)
        res.status(400).json({
          code: "200",
          status: "Failure",
          details: {},
          message: "Invalid Credentials",
        });
      if (data) {
        User.find({ phone }).then((result) => {
          if (result.length > 0) {
            res.status(200).json({
              code: "200",
              status: "Success",
              details: { user_id: result[0].user_id },
              message: "User verified Successfully",
            });
          } else {
            res.status(400).json({
              code: "400",
              status: "Failure",
              details: {},
              message: "User not found",
            });
          }
        });
      } else {
        return res.status(400).json({
          code: "400",
          status: "Failure",
          details: {},
          message: "User not found",
        });
      }
    });
  });
});

AuthRouter.post("/api/updateProfile", (req, res) => {
  const { user_id, address, name, dob, gender, designation } = req.body;
  let path = req.protocol + "://" + req.headers.host + "/public/" + images.name;

  images.mv(path, (error) => {
    if (error) {
      console.error(error);
      res.writeHead(500, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ status: "error", message: error }));
      return;
    }
  });
  User.findOneAndUpdate(
    { user_id },
    { address, name, dob, gender, designation, image: path }
  ).then((result) => {
    return res
      .status(200)
      .json({
        code: "201",
        status: "Success",
        details: {},
        message: "User Profile updated Successfully",
      })
      .catch((err) => {
        return res.status(500).json({
          code: "201",
          status: "Failure",
          details: {},
          message: "User Profile updated Successfully",
        });
      });
  });
});

module.exports = AuthRouter;
