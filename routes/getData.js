const express = require("express");
const RouterGet = express.Router();
const mongoose = require("mongoose");
const DIR = "./public/";
const Visit = mongoose.model("Visit");
const User = mongoose.model("User");

// get data from frontend
RouterGet.post("/api/addVisit", async (req, res) => {
  console.log(req.body.json);
  let paths = [];
  if (!req.files)
    return res.status(400).json({ error: "Invalid request, image required" });
  if (req.files) {
    console.log(req.files);
    const images = req.files.image;
    if (Array.isArray(images)) {
      await images.forEach((image) => {
        let path =
          req.protocol + "://" + req.headers.host + "/public/" + image.name;
        newPath = DIR + image.name;
        paths.push(path);
        image.mv(newPath, (error) => {
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
    } else {
      let path =
        req.protocol + "://" + req.headers.host + "/public/" + images.name;
      newPath = DIR + images.name;
      paths.push(path);
      images.mv(newPath, (error) => {
        if (error) {
          console.error(error);
          res.writeHead(500, {
            "Content-Type": "application/json",
          });
          res.end(JSON.stringify({ status: "error", message: error }));
          return;
        }
      });
    }
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
            saveVisit(req, res, data._id, paths);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        saveVisit(req, res, result._id, paths);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

const saveVisit = (req, res, user_id, paths) => {
  const data = JSON.parse(req.body.json);
  if (Array.isArray(data)) {
    data.forEach((visit) => {
      visit.modePatienList.map((patient) => {
        for (let i = 0; i < paths.length; i++) {
          return (patient.image = paths[i]);
        }
      });
    });
  } else {
    data.modePatienList.map((patient) => {
      for (let i = 0; i < paths.length; i++) {
        return (patient.image = paths[i]);
      }
    });
  }
  const visit = new Visit({
    image: paths,
    modelVisitList: newData,
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
