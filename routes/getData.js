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
  // if (!req.files)
  //   return res.status(400).json({ error: "Invalid request, image required" });
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

  saveVisit(req, res, req.body.appUserId, paths);
});

const saveVisit = (req, res, user_id, paths) => {
  const data = req.body.json;
  let sendAll = false;
  if (Array.isArray(data)) {
    let oldVisit = data[0].modelPatientList[0].modelVisitList[0].visit_id.split(
      "_"
    );
    oldVisit[oldVisit.length - 1] = oldVisit[oldVisit.length - 1] - 1;
    oldVisit = oldVisit.join("_");
    VisitList.find({ visit_id: oldVisit }).then((result) => {
      if (result.length > 0) {
        return (sendAll = true);
      }
    });
    data.forEach((visit) => {
      visit.modelPatientList.forEach((patient) => {
        patient.modelVisitList.forEach((visit) => {
          const visitList = new VisitList({
            visit_id: visit.visit_id,
          });
          visitList
            .save()
            .then((result) => {
              console.log("success");
            })
            .catch((err) => {
              console.log("failed");
            });
        });
      });

      visit.modelPatientList.map((patient) => {
        for (let i = 0; i < paths.length; i++) {
          return (patient.image = paths[i]);
        }
      });
    });
  } else {
    console.log(data);
    let oldVisit = data.modelPatientList[0].modelVisitList[0].visit_id.split(
      "_"
    );
    oldVisit[oldVisit.length - 1] = oldVisit[oldVisit.length - 1] - 1;
    console.log(oldVisit);
    oldVisit = oldVisit.join("_");

    data.modelPatientList.forEach((patient) => {
      patient.modelVisitList.forEach((visit) => {
        console.log(visit.visit_id);
        const visitList = new VisitList({
          visit_id: visit.visit_id,
        });
        visitList
          .save()
          .then((result) => {
            console.log("success");
          })
          .catch((err) => {
            console.log("failed");
          });
      });
    });

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
      res.status(500).json({ code: "500", status: "Failure", details: {} })
    );
};

module.exports = RouterGet;
