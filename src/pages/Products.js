import React, { useEffect, useState } from "react";
import api, { createItem } from "../api";

export default function Products({ user }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // create form state
  const [externalId, setExternalId] = useState("");
  const [title, setTitle] = useState("");
  const [metadata, setMetadata] = useState("");

  const fetchItems = async () => {
    try {
      const res = await api.get("/items");
      setItems(res.data || []);
    } catch (e) {
      console.error(e);
      alert("Failed to load items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreate = async () => {
    if (!externalId || !title) {
      return alert("externalId and title required");
    }

    setLoading(true);
    try {
      await createItem({ externalId, title, metadata });
      setExternalId("");
      setTitle("");
      setMetadata("");
      fetchItems(); // refresh list
    } catch (e) {
      console.error(e);
      alert("Item create failed (check login / role)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Products</h2>

      {/* CREATE ITEM */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Create Item</h3>

        <input
          placeholder="External ID (e.g. product_1)"
          value={externalId}
          onChange={e => setExternalId(e.target.value)}
        />

        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Metadata (optional)"
          value={metadata}
          onChange={e => setMetadata(e.target.value)}
        />

        <button className="btn" onClick={handleCreate} disabled={loading}>
          {loading ? "Creating..." : "Create Item"}
        </button>
      </div>

      {/* ITEM LIST */}
      <div className="grid">
        {items.length === 0 ? (
          <p>No items yet</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="card">
              <h3>{item.title}</h3>
              <p><b>ID:</b> {item.externalId}</p>
              {item.metadata && <p>{item.metadata}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
