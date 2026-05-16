import { useCallback, useEffect, useState } from "react";
import { notesApi } from "../api.js";
import NoteCard from "../components/NoteCard.jsx";
import NoteForm from "../components/NoteForm.jsx";

const LIMIT = 10;

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = activeSearch
        ? await notesApi.search(activeSearch)
        : await notesApi.list(page, LIMIT);
      const sorted = [...data].sort((a, b) => {
        if (a.isPinned !== b.isPinned) return b.isPinned - a.isPinned;
        const order = { high: 3, medium: 2, low: 1 };
        return (order[b.priority] || 0) - (order[a.priority] || 0);
      });
      setNotes(sorted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, activeSearch]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleCreate = async (form) => {
    await notesApi.create(form);
    setShowForm(false);
    setPage(1);
    setActiveSearch("");
    setSearchQuery("");
    await loadNotes();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setActiveSearch(searchQuery.trim());
  };

  const clearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
    setPage(1);
  };

  const hasMore = !activeSearch && notes.length === LIMIT;

  return (
    <div className="notes-page">
      <div className="page-header">
        <div>
          <h1>My Notes</h1>
          <p className="muted">
            {activeSearch ? `Results for "${activeSearch}"` : "Create, pin, and prioritize your notes."}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Close" : "+ New note"}
        </button>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes by title or content..."
        />
        <button type="submit" className="btn btn-secondary">
          Search
        </button>
        {activeSearch && (
          <button type="button" className="btn btn-ghost" onClick={clearSearch}>
            Clear
          </button>
        )}
      </form>

      {showForm && (
        <section className="panel">
          <h2>New note</h2>
          <NoteForm
            submitLabel="Create note"
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </section>
      )}

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p className="muted loading-text">Loading notes...</p>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <p>{activeSearch ? "No notes match your search." : "No notes yet. Create your first one!"}</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      )}

      {!activeSearch && (
        <div className="pagination">
          <button
            type="button"
            className="btn btn-ghost"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className="muted">Page {page}</span>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={!hasMore}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
