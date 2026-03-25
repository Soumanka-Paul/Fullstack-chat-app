import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { generateTokenAndSetCookie } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

dotenv.config();

export const signup = async (req, res) => {
  const { email, fullname, password } = req.body;

  try {
    if (!email || !fullname || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: email.toLowerCase(),
      fullname,
      password: hashedPassword,
    });

    generateTokenAndSetCookie(newUser._id, res);

  return res.status(201).json({
  message: "User created successfully",
  user: {
    id: newUser._id,
    email: newUser.email,
    fullname: newUser.fullname,
    profilePic: newUser.profilePic,   
    createdAt: newUser.createdAt,     
  },
});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
   try {
     if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });
   if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
      const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
     if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
     // Generate JWT + store in cookie
    generateTokenAndSetCookie(existingUser._id, res);
     
// ✅ Correct — use existingUser
return res.status(200).json({
  message: "Login successful",
  user: {
    id: existingUser._id,
    email: existingUser.email,
    fullname: existingUser.fullname,
    profilePic: existingUser.profilePic,
    createdAt: existingUser.createdAt,
  },
});
   } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    message: "Logged out successfully",
  });
};

export const updateProfile = async (req,res)=>{
    try {
        const {profilePic} = req.body;
       const userId = req.user._id;
       if(!profilePic){
        return res.status(400).json({ message: "Profile picture is required" });
       }
     const uploadResponse =  await cloudinary.uploader.upload(profilePic);
     const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
     return res.status(200).json({message:"Profile updated successfully",user:updatedUser});
  
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}
// auth.controller.js
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({ user: req.user }); // ← wrap in { user: ... }
  } catch (error) {
    console.log("Error in CheckAuth Controller", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};