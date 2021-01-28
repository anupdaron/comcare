const express = require("express");
const RouterSend = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const DIR = "./public/";
const Visit = mongoose.model("Visit");
const User = mongoose.model("User");

// send data
RouterSend.get("/receive", (req, res) => {
  Visit.find({ retrieved: false })
    .then((result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          Visit.findOneAndUpdate({ _id: item._id }, { retrieved: true })
            .then(() => {
              console.log("success");
            })
            .catch((err) => {
              return res.status(500).json({ error: "something went wrong" });
            });
        });
        return res.status(200).json({
          modelPatientList: result.visit,
        });
      } else {
        res.status(200).json({ message: "You are on sync" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "somewthing went wrong" });
    });
});

module.exports = RouterSend;
