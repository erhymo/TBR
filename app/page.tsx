"use client";
import { useState } from "react";

type Article = {
  source: string;
  title: string;
  url: string;
  published: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.articles);
      if (data.articles.length === 0) setError("Ingen treff.");
    } catch {
      setError("Noe gikk galt med søket.");
    }
    setLoading(false);
  };

  return (
    <main className="bg-gradient-to-br from-blue-200 to-blue-400 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">TBR</h1>
      <form className="mb-4 flex gap-2" onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="border rounded px-2 py-1"
          placeholder="Søk etter artikkel..."
        />
        <button type="submit" className="px-2 py-1 bg-gray-200 rounded">
          Søk
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-gray-200 rounded"
          onClick={() => {
            setQuery("");
            setResults([]);
            setError("");
          }}
        >
          Nullstill
        </button>
      </form>
      {loading && <div>Laster...</div>}
      {error && <div>{error}</div>}
      <ol className="w-full max-w-xl">
        {results.map((a, i) => (
          <li key={a.url} className="mb-4">
            <span className="font-bold">{i + 1}.</span>{" "}
            <span className="text-blue-900 font-semibold">{a.source}</span>{" "}
            <span className="text-gray-600">{a.published && new Date(a.published).toLocaleString()}</span>
            <br />
            <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
              {a.title}
            </a>
          </li>
        ))}
      </ol>
    </main>
  );
}
