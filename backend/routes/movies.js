const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const Review = require("../models/Review");
const auth = require("../middleware/auth");

// GET /movies?search=&genre=&year=&page=
router.get("/", async (req, res) => {
  const { page = 1, limit = 10, genre, year, search } = req.query;
  const query = {};
  if (genre) query.genre = genre;
  if (year) query.releaseYear = Number(year);
  if (search) query.title = { $regex: search, $options: "i" };
  try {
    const movies = await Movie.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /movies/:id
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Not found" });
    const reviews = await Review.find({ movie: movie._id }).populate(
      "user",
      "username profilePic"
    );
    res.json({ movie, reviews });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /movies (admin only -> simple flag check via env ADMIN_TOKEN or implement isAdmin; here we keep it simple: token must match)
router.post("/", auth, async (req, res) => {
  // For assignment: allow creation if user is "admin" by email matching ADMIN_EMAIL env OR implement isAdmin
  if (process.env.ADMIN_EMAIL && req.user.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Forbidden" });
  }
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ message: "Bad data", error: err.message });
  }
});

// GET /movies/:id/reviews
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.id }).populate(
      "user",
      "username profilePic"
    );
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /movies/:id/reviews
router.post("/:id/reviews", auth, async (req, res) => {
  const { rating, text } = req.body;
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const review = new Review({
      user: req.user.id,
      movie: movie._id,
      rating,
      text,
    });
    await review.save();

    // Recalculate average
    const agg = await Review.aggregate([
      { $match: { movie: movie._id } },
      {
        $group: { _id: "$movie", avg: { $avg: "$rating" }, count: { $sum: 1 } },
      },
    ]);
    if (agg[0]) {
      movie.averageRating = Math.round(agg[0].avg * 10) / 10;
      movie.reviewsCount = agg[0].count;
      await movie.save();
    }

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
