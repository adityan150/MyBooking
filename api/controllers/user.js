import User from "../models/User.js";

export const updateUser = async (req, res, next) => {
  try {
    // Check if the username is already taken.
    var user = await User.findOne({ username: req.body.username });
    if (user) return next(createError(400, "Username already taken."));

    // Check if the email is already taken.
    user = await User.findOne({ email: req.body.email });
    if (user) return next(createError(400, "Email already taken."));

    // Update the user.
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
