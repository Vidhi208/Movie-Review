const dotenv = require("dotenv");
// const connectDB = require("./config/db.js")

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const userRoutes = require("./routes/users");

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
