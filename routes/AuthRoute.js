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
  console.log(phone, password);
  User.find().then((result) => {
    if (result.length > 0) {
      createUser(req, res, phone, password, result.length + 1);
    } else {
      createUser(req, res, phone, password, 1);
    }
  });
});
const createUser = (req, res, phone, password, chw_id) => {
  const user = new User({
    chw_id,
    phone,
    password,
    chw_address: "",
    chw_name: "",
    image: "",
    chw_dob: "",
    chw_gender: "",
    chw_designation: "",
  });
  user
    .save()
    .then((result) => {
      res.status(201).json({
        code: "200",
        status: "Success",
        details: { chw_id: result.chw_id },
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
            let details = { chw_id: result[0].chw_id };
            if (result[0].chw_name !== "")
              return (details.chw_name = result[0].chw_name);
            if (result[0].chw_designation !== "")
              return (details.chw_designation = result[0].chw_designation);
            if (result[0].chw_address !== "")
              return (details.chw_address = result[0].chw_address);
            if (result[0].chw_gender !== "")
              return (details.chw_gender = result[0].chw_gender);
            if (result[0].chw_dob !== "")
              return (details.chw_dob = result[0].chw_dob);

            res.status(200).json({
              code: "200",
              status: "Success",
              details,
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
  console.log(req.body, req.files);
  const image = req.files.image;
  const {
    chw_id,
    chw_address,
    chw_name,
    chw_dob,
    chw_gender,
    chw_designation,
  } = req.body;
  let path = req.protocol + "://" + req.headers.host + "/public/" + image.name;

  image.mv(`./public/${image.name}`, (error) => {
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
    { chw_id },
    {
      chw_address,
      chw_name,
      chw_dob,
      chw_gender,
      chw_designation,
      image: path,
    }
  )
    .then((result) => {
      return res.status(200).json({
        code: "201",
        status: "Success",
        details: {},
        message: "User Profile updated Successfully",
      });
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

module.exports = AuthRouter;
