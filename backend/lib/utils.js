import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign(
    {  userId: userId },
    process.env.JWT_SECRET,
    { expiresIn: "5h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV != 'development', // change to true in production
    sameSite:'strict',
    maxAge: 5 * 60 * 60 * 1000 // 5 hours
  });

  return token;
};