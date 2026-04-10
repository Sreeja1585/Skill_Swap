const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
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

// SEND MESSAGE
router.post("/send", verify, async (req, res) => {
  try {
    const msg = new Message({
      senderId: req.user.id,
      receiverId: req.body.receiverId,
      text: req.body.text
    });

    await msg.save();
    res.json({ message: "Message sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET MESSAGES with specific user
router.get("/:receiverId", verify, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: req.params.receiverId },
        { senderId: req.params.receiverId, receiverId: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
