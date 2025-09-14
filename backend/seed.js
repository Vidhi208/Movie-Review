require("dotenv").config();
const mongoose = require("mongoose");
const Movie = require("./models/Movie");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connect"))
  .catch((e) => console.error(e));

async function seed() {
  await Movie.deleteMany({});
  await User.deleteMany({});

  const movies = [
    {
      title: "The Shawshank Redemption",
      genre: ["Drama"],
      releaseYear: 1994,
      synopsis: "Two imprisoned men...",
      posterUrl: "",
    },
    {
      title: "Inception",
      genre: ["Sci-Fi", "Action"],
      releaseYear: 2010,
      synopsis: "A thief who steals corporate secrets...",
      posterUrl: "",
    },
    {
      title: "Interstellar",
      genre: ["Sci-Fi", "Drama"],
      releaseYear: 2014,
      synopsis: "A team travels through a wormhole...",
      posterUrl: "",
    },
  ];
  await Movie.insertMany(movies);

  const hashed = await bcrypt.hash("password123", 10);
  const user = new User({
    username: "test",
    email: process.env.ADMIN_EMAIL || "test@example.com",
    password: hashed,
  });
  await user.save();

  console.log("Seed done");
  process.exit();
}

seed();
