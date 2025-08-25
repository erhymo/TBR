"use client";

import { useState } from "react";

type Article = {
  source: string;
  title: string;
  url: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setArticles([]);
    try {
      const res = await fetch(`/api/articles?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setArticles(data.articles);
      if (data.articles.length === 0) {
        setError("Ingen artikler funnet.");
      }
    } catch {
      setError("Noe gikk galt med søket.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
      <h1 className="text-6xl font-extrabold text-gray-900 drop-shadow-lg mb-8 text-center">TBR</h1>
      <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-xl mb-8">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Søk etter aksje eller selskap..."
          className="flex-1 px-4 py-3 border border-blue-200 rounded-lg shadow focus:outline-none text-lg"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 text-lg"
          disabled={loading}
        >
          {loading ? "Søker..." : "Søk"}
        </button>
      </form>
      {error && <div className="text-red-600 mb-4 text-lg">{error}</div>}
      <ul className="space-y-4 w-full max-w-xl">
        {articles.map((article, idx) => (
          <li key={idx} className="border rounded-lg p-4 bg-white shadow">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 font-semibold hover:underline text-lg">
              {article.title}
            </a>
            <div className="text-xs text-gray-500 mt-1">Kilde: {article.source}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
