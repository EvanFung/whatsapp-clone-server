import http from "http";
import path from "path";
import methods from "methods";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import errorhandler from "errorhandler";
import mongoose from "mongoose";
const PORT = 8080;
//Create global app object
const app = express();

app.use(cors());

//normal express config defaults
app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require("method-override")());
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: "conduit",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

app.use(errorhandler());

//for convinience we using the mlab uri
mongoose.connect(
  "mongodb://evanfung:password@ds151809.mlab.com:51809/whatsapp-clone"
);
mongoose.connection
  .once("open", () => console.log("Connected to MongoLab instance."))
  .on("error", error => console.log("Error connecting to MongoLab:", error));
mongoose.set("debug", true);

require("./models/User");
require("./config/passport");

app.use(require("./routes"));

app.listen(PORT, () =>
  console.log(`Server is now running on http://localhost:${PORT}`)
);
