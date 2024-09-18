import User from "../models/User";
import bcrypt from "bcryptjs";
import Bookings from "../models/Bookings";
import mongoose from "mongoose";

// Fetch all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// User signup
export const singup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || name.trim() === "" || email.trim() === "" || password.trim() === "") {
    return res.status(422).json({ message: "Invalid inputs" });
  }

  const hashedPassword = bcrypt.hashSync(password);
  try {
    const user = new User({ name, email, password: hashedPassword });
    const savedUser = await user.save();
    return res.status(201).json({ id: savedUser._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create user", error: err.message });
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email, password } = req.body;

  if (!name || !email || !password || name.trim() === "" || email.trim() === "" || password.trim() === "") {
    return res.status(422).json({ message: "Invalid inputs" });
  }

  const hashedPassword = bcrypt.hashSync(password);
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findByIdAndUpdate(id, { name, email, password: hashedPassword }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update user", error: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findByIdAndRemove(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};

// User login
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return res.status(422).json({ message: "Invalid inputs" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    return res.status(200).json({ message: "Login successful", id: existingUser._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Get bookings of a user
export const getBookingsOfUser = async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const bookings = await Bookings.find({ user: id })
      .populate("movie")
      .populate("user");

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found" });
    }

    return res.status(200).json({ bookings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to get bookings", error: err.message });
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to get user", error: err.message });
  }
};
