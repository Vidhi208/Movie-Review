const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Movie = require("../models/Movie");
const auth = require("../middleware/auth");

// GET user profile + reviews
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Not found" });
    // fetch reviews
    const Review = require("../models/Review");
    const reviews = await Review.find({ user: user._id }).populate(
      "movie",
      "title posterUrl"
    );
    res.json({ user, reviews });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update profile (only user)
router.put("/:id", auth, async (req, res) => {
  if (req.user.id !== req.params.id)
    return res.status(403).json({ message: "Forbidden" });
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET watchlist
router.get("/:id/watchlist", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("watchlist");
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST add to watchlist
router.post("/:id/watchlist", auth, async (req, res) => {
  if (req.user.id !== req.params.id)
    return res.status(403).json({ message: "Forbidden" });
  const { movieId } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.watchlist.includes(movieId))
      return res.status(400).json({ message: "Already in watchlist" });
    user.watchlist.push(movieId);
    await user.save();
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE remove from watchlist
router.delete("/:id/watchlist/:movieId", auth, async (req, res) => {
  if (req.user.id !== req.params.id)
    return res.status(403).json({ message: "Forbidden" });
  try {
    const user = await User.findById(req.params.id);
    user.watchlist = user.watchlist.filter(
      (m) => m.toString() !== req.params.movieId
    );
    await user.save();
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
