import React, { useEffect, useState } from "react";
import { listItems, recordInteraction } from "../api";

export default function Products({ user }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await listItems();
      setItems(res.data);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }

  async function viewItem(item) {
    const payload = { userId: user.userId, externalItemId: item.externalId, eventType: "view" };
    try { await recordInteraction(payload); alert("Interaction recorded"); }
    catch { alert("Failed"); }
  }

  if (loading) return <p>Loading items...</p>;

  return (
    <div>
      <h2>Products</h2>
      <div className="grid">
        {items.map(it => (
          <div key={it.externalId} className="card">
            <h3>{it.title}</h3>
            <p>{it.metadata ? JSON.stringify(it.metadata).slice(0,80) : "No description"}</p>
            <button className="btn" onClick={() => viewItem(it)}>View / Record</button>
          </div>
        ))}
      </div>
    </div>
  );
}
