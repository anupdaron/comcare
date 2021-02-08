const express = require("express");
const RouterGet = express.Router();
const mongoose = require("mongoose");
const DIR = "./public/";
const Visit = mongoose.model("Visit");
const VisitList = mongoose.model("VisitList");
const Patient = mongoose.model("Patient");
const User = mongoose.model("User");

// get data from frontend
RouterGet.post("/api/addVisit", async (req, res) => {
  let paths = [];
  // if (!req.files)
  //   return res.status(400).json({ error: "Invalid request, image required" });
  if (req.files) {
    let images = req.files.image;
    if (!Array.isArray(images)) {
      images = array(images);
    }
    await images.forEach((image) => {
      let path = "https://" + req.headers.host + "/public/" + image.name;
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
    savePatient(req, res, paths);
  }
});
//check json
function isValidJsonString(jsonString) {
  if (!(jsonString && typeof jsonString === "string")) {
    return jsonString;
  }

  try {
    JSON.parse(jsonString);
    return JSON.parse(jsonString);
  } catch (error) {
    return jsonString;
  }
}

const savePatient = (req, res, paths) => {
  console.log("in patient");
  console.log(paths);
  let data = isValidJsonString(req.body.json);
  if (!Array.isArray(data)) {
    data = [data];
  }
  data.forEach((data) => {
    console.log(data);
    let i = 0;
    data.modelPatientList.forEach((patient) => {
      console.log(patient);
      Patient.find({ patientId: patient.patientId }).then((result) => {
        if (result.length > 0) {
          console.log("patient exists");
        } else {
          const newPatient = new Patient({
            user: data.appUserId,
            patientAddedDate: patient.patientAddedDate,
            patientAge: patient.patientAge,
            patientDob: patient.patientDob,
            patientFirstName: patient.patientFirstName,
            patientFullName: patient.patientFullName,
            patientGender: patient.patientGender,
            patientHouseno: patient.patientHouseno,
            patientId: patient.patientId,
            patientLastName: patient.patientLastName,
            patientMiddleName: patient.patientMiddleName,
            patientMunicipality: patient.patientMunicipality,
            patientPhone: patient.patientPhone,
            patientSpouseFullName: patient.patientSpouseFullName,
            patientVillagename: patient.patientVillagename,
            patientspousefirstname: patient.patientspousefirstname,
            patientspouselastname: patient.patientspouselastname,
            patientwardno: patient.patientwardno,
            image: paths[i],
          });
          newPatient
            .save()
            .then((result) => {
              console.log("success sith patient");
            })
            .then((err) => {
              console.log(err);
            });
        }
      });
      i++;

      patient.modelVisitList.forEach((visit) => {
        const visitList = new VisitList({
          visit,
          user_id: data.appUserId,
          patientId: patient.patientId,
        });
        visitList.save().then((result) => {
          console.log("success with visitlist");
        });
      });
    });
    data.modelPatientList.forEach((patient) => {
      Patient.find({ patientId: patient.patientId }).then((result) => {
        if (result.length > 0) {
          patient.image = result[0].image;
        }
      });
    });
  });

  const visit = new Visit({
    AppUserList: data,
    user: data[0].appUserId,
    synced: false,
  });
  visit
    .save()
    .then((result) => {
      res.status(200).json({ code: "200", status: "Success", details: {} });
    })
    .catch((err) => {
      console.log("first", err);
      res.status(500).json({ code: "500", status: "Failure", details: {} });
    });
};

RouterGet.post("/api/checkVisit", async (req, res) => {
  const visit_id = req.body;
  console.log(visit_id);
  const user_id = visit_id[0].split("_")[0];
  let modelPatientList = [];
  visit_id.forEach((visit_id) => {
    VisitList.find({
      visit: { $elemMatch: { visit_id: { $ne: visit_id } } },
      user_id,
    })
      .then((result) => {
        if (result.length < 1) {
          res.status(200).json({ appUserId: user_id, modelPatientList });
        }
        let patients = [];
        let visits = result;
        let visitList = [];

        let i = 0;
        function firstCallback() {
          return new Promise((resolve) => {
            let i = 1;
            result.forEach((item) => {
              Patient.find({ patientId: item.patientId }).then((data) => {
                if (result.length > 0) {
                  modelPatientList.push(data[0]);
                  if (i === result.length) {
                    modelPatientList = getUnique(modelPatientList);

                    resolve();
                  }
                  i++;
                } else {
                  console.log("not there");
                }
              });
            });
          });
        }

        const getUnique = (array) =>
          array.reduce(
            (acc, x) =>
              acc.concat(
                acc.find((y) => y.patientId === x.patientId) ? [] : [x]
              ),
            []
          );

        function secondCallBack() {
          return new Promise((resolve) => {
            let i = 1;
            let j = 1;
            visits.forEach((item) => {
              modelPatientList.forEach((pat) => {
                if (pat.patientId === item.patientId) {
                  visitList = [...visitList, item.visit[0]];
                  const {
                    patientAddedDate,
                    patientAge,
                    patientDob,
                    patientFirstName,
                    patientFullName,
                    patientGender,
                    patientHouseno,
                    patientId,
                    patientLastName,
                    patientMiddleName,
                    patientMunicipality,
                    patientPhone,
                    patientSpouseFullName,
                    patientVillagename,
                    patientspousefirstname,
                    patientspouselastname,
                    patientwardno,
                  } = pat;
                  let newModel = [
                    {
                      modelVisitList: visitList,
                      patientAddedDate,
                      patientAge,
                      patientDob,
                      patientFirstName,
                      patientFullName,
                      patientGender,
                      patientHouseno,
                      patientId,
                      patientLastName,
                      patientMiddleName,
                      patientMunicipality,
                      patientPhone,
                      patientSpouseFullName,
                      patientVillagename,
                      patientspousefirstname,
                      patientspouselastname,
                      patientwardno,
                    },
                  ];
                  modelPatientList = newModel;
                }
              });

              if (i === visits.length) {
                resolve();
              }
              i++;
            });
          });
        }

        async function callback_Original() {
          try {
            await firstCallback();
            await secondCallBack();

            res.status(200).json({ appUserId: user_id, modelPatientList });
          } catch (error) {
            console.log(error);
          }
        }

        callback_Original();
      })
      .catch((err) => {
        console.log(err);
        res.status(200).json({
          appUserId: user_id,
          message: "you are on sync",
          details: {},
        });
      });
  });
});

module.exports = RouterGet;
