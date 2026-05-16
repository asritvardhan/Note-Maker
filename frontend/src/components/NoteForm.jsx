import { useState } from "react";

const empty = {
  title: "",
  content: "",
  isPinned: false,
  priority: "low",
};

export default function NoteForm({ initial = empty, onSubmit, onCancel, submitLabel }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    content: initial.content || "",
    isPinned: initial.isPinned ?? false,
    priority: initial.priority || "low",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}
      <label>
        Title
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Note title"
          required
        />
      </label>
      <label>
        Content
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Write your note..."
          rows={5}
          required
        />
      </label>
      <div className="form-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isPinned"
            checked={form.isPinned}
            onChange={handleChange}
          />
          Pin this note
        </label>
        <label>
          Priority
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>
      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
