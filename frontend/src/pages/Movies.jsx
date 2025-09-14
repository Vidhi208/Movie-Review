import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  async function fetchMovies() {
    const res = await API.get("/movies");
    setMovies(res.data);
  }

  const filtered = movies.filter((m) =>
    m.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <h2>Movies</h2>
      <input
        placeholder="Search title"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 12,
        }}
      >
        {filtered.map((m) => (
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
            <Link to={`/movies/${m._id}`}>Open</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
