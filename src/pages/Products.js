import React, { useEffect, useState } from "react";
import { listItems, recordInteraction, createItem } from "../api";

export default function Products({ user }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // create form state
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
      const data = res.data?.data || res.data;
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  /* ------------------ CREATE ITEM ------------------ */
  async function handleCreate() {
    if (!externalId || !title) {
      return alert("externalId and title required");
    }

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
      alert("Item create failed (check login / role)");
    } finally {
      setCreating(false);
    }
  }

  /* ------------------ RECORD INTERACTION ------------------ */
  async function viewItem(item) {
    const payload = {
      userId:
        user?.userId ||
        user?.id ||
        Number(localStorage.getItem("userId")) ||
        1,

      // normalize item id (NO spaces)
      externalItemId: (
        item.externalId ||
        item.external_id ||
        item.title
      )
        .toString()
        .trim()
        .replace(/\s+/g, "_"),

      eventType: "VIEW"
    };

    try {
      console.log("SENDING PAYLOAD:", payload);
      await recordInteraction(payload);
      alert("Interaction recorded (view)");
    } catch (err) {
      console.error("Interaction error:", err);
      alert("Failed to record interaction");
    }
  }


  if (loading) return <p>Loading items...</p>;

  return (
    <div>
      <h2>Products</h2>

      {/* -------- CREATE ITEM -------- */}
      <div className="card" style={{ marginBottom: 20 }}>
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

        <button className="btn" onClick={handleCreate} disabled={creating}>
          {creating ? "Creating..." : "Create Item"}
        </button>
      </div>

      {/* -------- ITEM LIST -------- */}
      <div className="grid">
        {items.length === 0 ? (
          <p>No items yet</p>
        ) : (
          items.map(it => (
            <div
              key={it.externalId || it.external_id || it.id}
              className="card"
            >
              <h3>{it.title}</h3>
              <p>
                {it.metadata
                  ? JSON.stringify(it.metadata).slice(0, 80)
                  : "No description"}
              </p>

              <button
                className="btn"
                onClick={() => viewItem(it)}
              >
                View / Record Interaction
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
