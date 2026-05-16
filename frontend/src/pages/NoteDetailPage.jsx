import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notesApi } from "../api.js";
import NoteForm from "../components/NoteForm.jsx";
import ShareModal from "../components/ShareModal.jsx";

export default function NoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [editing, setEditing] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await notesApi.get(id);
        if (!cancelled) setNote(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleUpdate = async (form) => {
    const updated = await notesApi.update(id, form);
    setNote(updated);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this note permanently?")) return;
    setDeleting(true);
    try {
      await notesApi.delete(id);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) {
    return <p className="muted loading-text">Loading note...</p>;
  }

  if (error && !note) {
    return (
      <div className="panel">
        <p className="form-error">{error}</p>
        <Link to="/" className="btn btn-ghost">
          Back to notes
        </Link>
      </div>
    );
  }

  const date = new Date(note.updatedAt || note.createdAt).toLocaleString();

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">
        ← All notes
      </Link>

      {editing ? (
        <section className="panel">
          <h1>Edit note</h1>
          <NoteForm
            initial={note}
            submitLabel="Save changes"
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        </section>
      ) : (
        <article className="note-detail panel">
          <div className="note-detail-meta">
            {note.isPinned && <span className="badge badge-pin">Pinned</span>}
            <span className={`badge badge-${note.priority || "low"}`}>
              {(note.priority || "low").charAt(0).toUpperCase() + (note.priority || "low").slice(1)}
            </span>
            <span className="muted">{date}</span>
          </div>
          <h1>{note.title}</h1>
          <div className="note-content">{note.content}</div>
          {note.sharedWith?.length > 0 && (
            <p className="muted shared-hint">
              Shared with {note.sharedWith.length} user(s)
            </p>
          )}
          <div className="detail-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShareOpen(true)}>
              Share
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
          {error && <p className="form-error">{error}</p>}
        </article>
      )}

      {shareOpen && (
        <ShareModal noteId={id} onClose={() => setShareOpen(false)} />
      )}
    </div>
  );
}
