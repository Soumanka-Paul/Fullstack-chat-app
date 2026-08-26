import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "5h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 5 * 60 * 60 * 1000,
  });

  return token;
};