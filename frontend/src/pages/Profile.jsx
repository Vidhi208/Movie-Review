import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../contexts/AuthContext";

export default function Profile() {
  const { id } = useParams();
  const { user: loggedInUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchWatchlist();
  }, [id]);

  async function fetchProfile() {
    try {
      const res = await API.get(`/users/${id}`);
      setProfile(res.data.user);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }

  async function fetchWatchlist() {
    try {
      const res = await API.get(`/users/${id}/watchlist`);
      setWatchlist(res.data);
    } catch (err) {
      console.error("Error fetching watchlist:", err);
    }
  }

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profile.username}'s Profile</h1>
      <p>Email: {profile.email}</p>
      <p>Joined: {new Date(profile.joinDate).toLocaleDateString()}</p>

      <hr />
      <h2>Watchlist</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        {watchlist.length === 0 && <p>No movies in watchlist</p>}
        {watchlist.map((m) => (
          <div key={m._id} style={{ border: "1px solid #ddd", padding: 10 }}>
            <img
              src={m.posterUrl || "/placeholder.png"}
              alt={m.title}
              style={{ width: "100%", height: 200, objectFit: "cover" }}
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
