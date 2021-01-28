const express = require("express");
const RouterGet = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const DIR = "./public/";
const Visit = mongoose.model("Visit");
const User = mongoose.model("User");

// define image location
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

//upload image
var upload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 },
  storage: storage,

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
}).single("image");

// get data from frontend
RouterGet.post("/send-info", (req, res) => {
  User.find({ user_id: req.body.appUserId })
    .then((result) => {
      if (result.length < 1) {
        const user = new User({
          username: "",
          user_id: req.body.appUserId,
          address: "",
          dateofbirth: "",
        });
        user
          .save()
          .then((data) => {
            saveVisit(req, res, data._id);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        saveVisit(req, res, result._id);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

const saveVisit = (req, res, user_id) => {
  const data = req.body;
  console.log(data.modelPatientList);
  const visit = new Visit({
    visit: data.modelPatientList,
    user: user_id,
    retrieved: false,
  });
  visit
    .save()
    .then((result) => {
      res.status(200).json({ message: "Succesful" });
    })
    .catch((err) => console.log(err));
  upload(req, res, async function (err) {
    //console.log(`file: ${req.file} and body: ${req.body}`);
  });
};

module.exports = RouterGet;
