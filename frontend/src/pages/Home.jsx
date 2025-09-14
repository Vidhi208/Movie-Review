import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  async function fetchMovies() {
    try {
      const res = await API.get("/movies");
      setMovies(res.data);
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
  }

  return (
    <div>
      <h1>Welcome to Movie Review Platform</h1>
      <h2>Featured Movies</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        {movies.slice(0, 6).map((m) => (
          <div key={m._id} style={{ border: "1px solid #ddd", padding: 10 }}>
            <img
              src={m.posterUrl || "/placeholder.png"}
              alt={m.title}
              style={{ width: "100%", height: 250, objectFit: "cover" }}
            />
            <h3>{m.title}</h3>
            <p>
              {m.releaseYear} • {m.genre?.join(", ")}
            </p>
            <Link to={`/movies/${m._id}`}>View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
