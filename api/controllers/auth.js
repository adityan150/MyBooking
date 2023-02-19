import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createError } from "../utils/error.js";

// Note that the register and login functions are async functions.
// This means that they return a promise.

export const register = async (req, res, next) => {
  try {
    // Check if the username is already taken.
    var user = await User.findOne({ username: req.body.username });
    if (user) return next(createError(400, "Username already taken."));

    // Check if the email is already taken.
    user = await User.findOne({ email: req.body.email });
    if (user) return next(createError(400, "Email already taken."));

    // Hash the password.
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);

    // Create a new user.
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      isAdmin: req.body.isAdmin,
    });

    // Save the user to the database.
    await newUser.save();

    // Send a response to the client.
    res.send("User has been registered.");
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    // Get the user from the database.
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found."));

    // Compare the password.
    const validPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!validPassword)
      return next(createError(400, "Wrong password or username."));

    // Create a token.
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    // Remove the password from the user object.
    const { password, isAdmin, ...otherDetails } = user._doc;

    // Send the token and the user details to the client.
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(otherDetails);
  } catch (error) {
    next(error);
  }
};
