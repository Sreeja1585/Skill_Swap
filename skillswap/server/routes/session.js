const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const jwt = require("jsonwebtoken");

// Middleware
const verify = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json("No token");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = verified;
    next();
  } catch {
    res.status(400).json("Invalid token");
  }
};

// REQUEST SESSION
router.post("/request", verify, async (req, res) => {
  try {
    const session = new Session({
      requesterId: req.user.id,
      providerId: req.body.providerId,
      skill: req.body.skill,
      date: req.body.date
    });

    await session.save();
    res.json({ message: "Session Requested" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET MY SESSIONS
router.get("/", verify, async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [
        { requesterId: req.user.id },
        { providerId: req.user.id }
      ]
    }).populate('requesterId providerId', 'name email').sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ACCEPT / REJECT
router.put("/:id", verify, async (req, res) => {
  try {
    const updated = await Session.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('requesterId providerId', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
