import crypto from "crypto";
import bcrypt from "bcryptjs";

import { User } from "../models/user.model.js";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";


export const signup = async (req, res) => {
  const { password, name } = req.body;
  try {
    if (!password || !name) {
      throw new Error("All fields are required");
    }
    const userAlreadyExists = await User.findOne({ name });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const user = new User({
      password: hashedPassword,
      name,
    });
    await user.save();

    generateTokenAndSetCookie(res, user._id);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
      },
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};


export const login = async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "invalid credentials",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "invalid credentials",
      });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastlogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error logging in", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};





export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in checkAuth", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
