import { useState, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("pitch_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleSubmit = async () => {
    const res = await fetch("/api/pitch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    });
    const data = await res.json();
    setResponse(data.result);
    const newEntry = { pitch: input, result: data.result };
    const updated = [newEntry, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem("pitch_history", JSON.stringify(updated));
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Startup PitchGPT 🚀</h1>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe your startup idea..." rows={4} style={{ width: "100%", padding: "0.5rem", marginTop: "1rem" }} />
      <button onClick={handleSubmit} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>Get Feedback</button>
      {response && <div style={{ marginTop: "2rem", background: "#f4f4f4", padding: "1rem" }}><strong>Investor Feedback:</strong><p>{response}</p></div>}
      <div style={{ marginTop: "3rem" }}>
        <h2>📚 Saved Pitches</h2>
        {history.map((entry, i) => (
          <div key={i} style={{ marginTop: "1rem", background: "#eee", padding: "1rem" }}>
            <p><strong>Pitch:</strong> {entry.pitch}</p>
            <p><strong>Feedback:</strong> {entry.result}</p>
          </div>
        ))}
      </div>
    </main>
  );
}