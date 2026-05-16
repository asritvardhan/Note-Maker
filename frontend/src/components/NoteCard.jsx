import { Link } from "react-router-dom";

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export default function NoteCard({ note }) {
  const date = new Date(note.updatedAt || note.createdAt).toLocaleDateString(
    undefined,
    { month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <Link to={`/notes/${note._id}`} className="note-card">
      <div className="note-card-top">
        {note.isPinned && <span className="badge badge-pin">Pinned</span>}
        <span className={`badge badge-${note.priority || "low"}`}>
          {priorityLabels[note.priority] || "Low"}
        </span>
      </div>
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <footer>{date}</footer>
    </Link>
  );
}
