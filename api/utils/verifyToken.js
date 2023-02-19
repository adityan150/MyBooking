import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  // Get the token from the cookies.
  const token = req.cookies.access_token;

  // If there is no token, return an error.
  if (!token) return next(createError(401, "You are not authenticated."));

  // Verify the token.
  jwt.verify(token, process.env.JWT, (error, user) => {
    if (error) return next(createError(403, "Invalid token."));
    console.log(user);
    // Add the user to the request object.
    req.user = user;

    // Call the next middleware.
    next();
  });
};

export const verifyUser = (req, res, next) => {
  // Verify the token.
  verifyToken(req, res, () => {
    // Check if the user is authorized.
    if (req.user.id === req.params.id || req.user.isAdmin) next();
    else return next(createError(403, "You are not authorized."));
  });
};

export const verifyAdmin = (req, res, next) => {
  // Verify the token.
  verifyToken(req, res, () => {
    // Check if the user is authorized.
    if (req.user.isAdmin) next();
    else return next(createError(403, "You are not authorized."));
  });
};
