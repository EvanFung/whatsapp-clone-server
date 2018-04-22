import mongoose from "mongoose";
import { Router } from "express";
import passport from "passport";
import auth from "../auth";
const router = Router();
const User = mongoose.model("User");

//sign up  user
router.post("/users", function(req, res, next) {
  const user = new User();
  const { username, email, password } = req.body.user;
  user.username = username;
  user.email = email;
  user.setPassword(password);
  user
    .save()
    .then(() => {
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

//login user
router.post("/users/login", function(req, res, next) {
  const { email, password } = req.body.user;
  if (!email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }
  if (!password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate("local", { session: false }, function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next); // passing context by js closure
});

export default router;
