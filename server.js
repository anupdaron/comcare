const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
require("./models/Visit");
require("./models/User");
require("./models/VisitList");
const RouterGet = require("./routes/getData");
const RouterSend = require("./routes/sendData");
const PORT = process.env.PORT || 5000;
const { MONGO_URL } = require("./Config/dbConfig");
const fileupload = require("express-fileupload");
const AuthRouter = require("./routes/AuthRoute");

//middlewares
app.use("/public", express.static("public"));
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use(fileupload());
app.use(RouterGet);
app.use(RouterSend);
app.use(AuthRouter);

//connect to database
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    return console.log("connected to database");
  })
  .catch((err) => {
    console.error(err);
  });

//listen to PORT
app.listen(PORT, () => {
  console.log(`Listening to port${PORT}`);
});
