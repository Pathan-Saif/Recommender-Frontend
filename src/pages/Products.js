import React, { useEffect, useState } from "react";
import { listItems, recordInteraction, createItem } from "../api";

export default function Products({ user }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create form state
  const [externalId, setExternalId] = useState("");
  const [title, setTitle] = useState("");
  const [metadata, setMetadata] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    try {
      const res = await listItems();
      if (Array.isArray(res.data)) {
        setItems(res.data);
      } else if (Array.isArray(res.data?.data)) {
        setItems(res.data.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!externalId || !title) return alert("External ID and title required");

    setCreating(true);
    try {
      await createItem({ externalId, title, metadata });
      setExternalId("");
      setTitle("");
      setMetadata("");
      await loadItems();
      alert("Item created successfully");
    } catch (err) {
      console.error(err);
      alert("Item creation failed");
    } finally {
      setCreating(false);
    }
  }

  async function viewItem(item) {
    const payload = {
      userId: user?.userId || user?.id || Number(localStorage.getItem("userId")) || 1,
      externalItemId: (item.externalId || item.external_id || item.title)
        .toString()
        .trim()
        .replace(/\s+/g, "_"),
      eventType: "VIEW",
    };

    try {
      await recordInteraction(payload);
      alert("Interaction recorded (view)");
    } catch (err) {
      console.error("Interaction error:", err);
      alert("Failed to record interaction");
    }
  }

  if (loading) return <p>Loading items...</p>;

  return (
    <div className="container">
      <h2>Products</h2>

      {/* Create Item Form */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Create Item</h3>

        <input
          placeholder="External ID (e.g. product_1)"
          value={externalId}
          onChange={(e) => setExternalId(e.target.value)}
        />

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Metadata (optional)"
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
        />

        <button className="btn" onClick={handleCreate} disabled={creating}>
          {creating ? "Creating..." : "Create Item"}
        </button>
      </div>

      {/* Item List */}
      {items.length === 0 ? (
        <p>No items yet</p>
      ) : (
        <div className="grid">
          {items.map((it) => (
            <div key={it.externalId || it.external_id || it.id} className="card">
              <h3>{it.title}</h3>
              <p>{it.metadata ? JSON.stringify(it.metadata).slice(0, 80) : "No description"}</p>
              <button className="btn" onClick={() => viewItem(it)}>
                View / Record Interaction
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
