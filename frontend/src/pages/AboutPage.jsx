import { useEffect, useState } from "react";
import { aboutApi } from "../api.js";

export default function AboutPage() {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aboutApi
      .get()
      .then(setInfo)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="muted loading-text">Loading...</p>;
  }

  if (error) {
    return <p className="form-error">{error}</p>;
  }

  const features = info["my features"] || info.features || {};

  return (
    <div className="about-page">
      <section className="panel about-hero">
        <p className="eyebrow">About this app</p>
        <h1>{info.name}</h1>
        <a href={`mailto:${info.email}`} className="about-email">
          {info.email}
        </a>
      </section>

      <section className="panel">
        <h2>Features</h2>
        <ul className="feature-list">
          {Object.entries(features).map(([title, desc]) => (
            <li key={title}>
              <strong>{title}</strong>
              <span>{desc}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
