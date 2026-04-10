const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware (verify token)
const verify = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json("Access denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = verified;
    next();
  } catch {
    res.status(400).json("Invalid token");
  }
};

// GET PROFILE
router.get("/profile", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json("User not found");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE PROFILE
router.put("/profile", verify, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MATCH USERS
router.get("/match", verify, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser.skillsWanted || currentUser.skillsWanted.length === 0) {
      return res.json([]);
    }

    const matches = await User.find({
      _id: { $ne: req.user.id }, // exclude self
      skillsOffered: { $in: currentUser.skillsWanted }
    }).select('name email skillsOffered skillsWanted');

    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
