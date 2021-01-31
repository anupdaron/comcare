const express = require("express");
const RouterSend = express.Router();
const mongoose = require("mongoose");
var fs = require("fs");
const Visit = mongoose.model("Visit");

// send data
RouterSend.get("/api/syncVisit", (req, res) => {
  Visit.find({ synced: false })
    .then(async (result) => {
      if (result.length > 0) {
        await result.forEach((item) => {
          Visit.findOneAndUpdate({ _id: item._id }, { synced: true })
            .then(() => {
              console.log("success");
            })
            .catch((err) => {
              return res.status(500).json({ error: "something went wrong" });
            });
        });

        return res.status(200).json(result);
      } else {
        res.status(200).json({ message: "You are on sync" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "something went wrong" });
    });
});

module.exports = RouterSend;
