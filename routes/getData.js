const express = require("express");
const RouterGet = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const DIR = "/public/";
const Visit = mongoose.model("Visit");
const User = mongoose.model("User");

// get data from frontend
RouterGet.post("/api/addVisit", (req, res) => {
  let path = "";
  if (req.files) {
    console.log(req.files);
    const images = req.files.image;
    paths = [];
    images.forEach((image) => {
      console.log(req.protocol, req.headers.host);
      path = req.protocol + "://" + req.headers.host + DIR + image.name;
      newPath = DIR + image.name;
      console.log(path);

      paths.push(newPath);
      image.mv(path, (error) => {
        if (error) {
          console.error(error);
          res.writeHead(500, {
            "Content-Type": "application/json",
          });
          res.end(JSON.stringify({ status: "error", message: error }));
          return;
        }
      });
    });
  }
  User.find({ user_id: req.body.json.appUserId })
    .then((result) => {
      if (result.length < 1) {
        const user = new User({
          username: "",
          user_id: req.body.json.appUserId,
          address: "",
          dateofbirth: "",
        });
        user
          .save()
          .then((data) => {
            saveVisit(req, res, data._id, path);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        saveVisit(req, res, result._id, path);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

const saveVisit = (req, res, user_id, path) => {
  const data = req.body.json;
  const visit = new Visit({
    image: paths,
    visit: data.modelPatientList,
    user: user_id,
    synced: false,
  });
  visit
    .save()
    .then((result) => {
      res.status(200).json({ message: "Succesful" });
    })
    .catch((err) => console.log(err));
};

module.exports = RouterGet;
