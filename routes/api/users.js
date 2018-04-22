import mongoose from "mongoose";
import { Router } from "express";
import passport from "passport";
import auth from "../auth";
const router = Router();
const User = mongoose.model("User");

//sign up a user
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

export default router;
