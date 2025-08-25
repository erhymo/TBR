
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
    <div className="w-full max-w-xl mx-auto py-8">
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Søk etter aksje eller selskap..."
          className="flex-1 px-4 py-2 border rounded shadow focus:outline-none"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Søker..." : "Søk"}
        </button>
      </form>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <ul className="space-y-4">
        {articles.map((article, idx) => (
          <li key={idx} className="border rounded p-4 bg-white shadow">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 font-semibold hover:underline">
              {article.title}
            </a>
            <div className="text-xs text-gray-500 mt-1">Kilde: {article.source}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
