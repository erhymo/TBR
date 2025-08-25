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
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="flex flex-col items-center w-full">
        <h1
          className="text-[7vw] font-extrabold text-blue-700 drop-shadow-2xl mb-10 text-center tracking-tight"
          style={{
            fontFamily: 'Segoe UI, Arial, sans-serif',
            letterSpacing: '-0.05em',
            textShadow: '0 2px 24px #60a5fa, 0 1px 0 #fff',
          }}
        >
          TBR
        </h1>
        <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-xl mb-12 justify-center">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Søk etter aksje eller selskap..."
            className="flex-1 px-4 py-4 border border-blue-200 rounded-xl shadow focus:outline-none text-xl text-gray-900 bg-white"
            style={{ minWidth: '300px', maxWidth: '500px' }}
          />
          <button
            type="submit"
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 text-xl shadow"
            disabled={loading}
          >
            {loading ? "Søker..." : "Søk"}
          </button>
          <button
            type="button"
            className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 text-xl shadow"
            onClick={() => {
              setQuery("");
              setArticles([]);
              setError("");
            }}
            disabled={loading && query === ""}
          >
            Nullstill
          </button>
        </form>
        {error && <div className="text-red-600 mb-4 text-lg">{error}</div>}
        <ul className="space-y-4 w-full max-w-xl">
          {articles.map((article, idx) => (
            <li key={idx} className="border rounded-xl p-4 bg-white shadow">
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 font-semibold hover:underline text-lg">
                {article.title}
              </a>
              <div className="text-xs text-gray-500 mt-1">Kilde: {article.source}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
