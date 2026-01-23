import React, { useState } from "react";
import { getRecommendations } from "../api";

export default function Recommendations({ user }) {
  const [recs, setRecs] = useState([]);   // default empty array
  const [k, setK] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchRecs = async () => {
    if (!user) return alert("Please login");

    setLoading(true);
    try {
      const userId = Number(user.userId);
      const kNumber = parseInt(k, 10) || 10;

      const res = await getRecommendations(userId, kNumber);
      const recsData = Array.isArray(res.data)
        ? res.data
        : res.data?.recommendations || [];

      setRecs(Array.isArray(recsData) ? recsData : []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch recommendations");
      setRecs([]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <h2>Recommendations</h2>
      <div style={{ marginBottom: 12 }}>
        <label>Top K: </label>
        <input
          value={k}
          onChange={(e) => setK(e.target.value)}
          style={{ width: 60 }}
        />
        <button className="btn" onClick={fetchRecs} style={{ marginLeft: 8 }}>
          Get Recommendations
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid">
          {recs.length === 0 ? (
            <p>No recommendations yet</p>
          ) : (
            recs.map((r, idx) => (
              <div key={idx} className="card">
                <h3>{r.externalId}</h3>
                <p>Score: {r.score?.toFixed(3)}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
