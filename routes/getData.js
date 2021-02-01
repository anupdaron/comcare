const express = require("express");
const RouterGet = express.Router();
const mongoose = require("mongoose");
const DIR = "./public/";
const Visit = mongoose.model("Visit");
const VisitList = mongoose.model("VisitList");
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
  let sendAll = false;
  if (Array.isArray(data)) {
    const oldVisit = data[0].visit_id.split("_");
    oldVisit = oldVisit[oldVisit.length - 1] - 1;
    oldVisit = oldVisit.join("_");

    VisitList.find({ visit_id: oldVisit }).then((result) => {
      if (result.length > 0) {
        return (sendAll = true);
      }
    });
    data.forEach((visit) => {
      visit.modelPatientList.map((patient) => {
        for (let i = 0; i < paths.length; i++) {
          return (patient.image = paths[i]);
        }
      });
    });
  } else {
    console.log(data);
    const oldVisit = data.visit_id.split("_");
    oldVisit = oldVisit[oldVisit.length - 1] - 1;
    oldVisit = oldVisit.join("_");

    VisitList.find({ visit_id: oldVisit }).then((result) => {
      if (result.length > 0) {
        return (sendAll = true);
      }
    });
    data.modelPatientList.map((patient) => {
      for (let i = 0; i < paths.length; i++) {
        return (patient.image = paths[i]);
      }
    });
  }
  const visit = new Visit({
    AppUserList: data,
    user: user_id,
    synced: false,
  });
  visit
    .save()
    .then((result) => {
      if (sendAll) {
        Visit.find().then((result) => {
          res
            .status(200)
            .json({ code: "200", status: "Success", details: result });
        });
      } else {
        res.status(200).json({ code: "200", status: "Success", details: {} });
      }
    })
    .catch((err) =>
      res.status(200).json({ code: "200", status: "Failure", details: {} })
    );
};

module.exports = RouterGet;
