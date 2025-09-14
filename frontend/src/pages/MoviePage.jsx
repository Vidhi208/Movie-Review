import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../contexts/AuthContext";

export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    const res = await API.get(`/movies/${id}`);
    setMovie(res.data.movie);
    setReviews(res.data.reviews);
  }

  async function submitReview(e) {
    e.preventDefault();
    if (!user) {
      alert("Login first");
      return;
    }
    await API.post(`/movies/${id}/reviews`, { rating, text });
    setText("");
    await load();
  }

  return movie ? (
    <div>
      <h2>
        {movie.title} ({movie.releaseYear})
      </h2>
      <p>{movie.synopsis}</p>
      <p>
        Average: {movie.averageRating} ({movie.reviewsCount} reviews)
      </p>

      <hr />
      <h3>Reviews</h3>
      {reviews.map((r) => (
        <div key={r._id}>
          <strong>{r.user.username}</strong> — {r.rating}⭐<p>{r.text}</p>
        </div>
      ))}

      <hr />
      <h3>Write a review</h3>
      <form onSubmit={submitReview}>
        <label>
          Rating:
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <br />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Your review"
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
