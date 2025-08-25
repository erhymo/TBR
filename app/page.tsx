
'use client';
import { useState } from 'react';

type Article = {
  source: string;
  date?: string;
  title?: string;
  url?: string;
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setResults(data.filter((r: Article) =>
        r.title && r.title.toLowerCase().includes(query.toLowerCase())
      ));
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-white text-6xl font-extrabold mb-12 mt-8 tracking-wide">TBR</h1>
      <form onSubmit={handleSearch} className="w-full max-w-xl flex flex-col items-center">
        <input
          type="text"
          placeholder="Søk etter aksje..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full px-6 py-4 rounded-lg text-lg mb-4 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <div className="flex gap-4 mb-8">
          <button
            type="submit"
            className="bg-white text-blue-600 font-bold px-6 py-2 rounded-lg hover:bg-blue-100 transition"
            disabled={loading}
          >
            {loading ? 'Laster...' : 'Søk'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Nullstill
          </button>
        </div>
      </form>
      {searched && (
        <ul className="bg-white bg-opacity-80 rounded-lg p-6 w-full max-w-2xl shadow-lg">
          {results.length === 0 ? (
            <li className="text-center text-gray-600">Ingen artikler funnet.</li>
          ) : (
            results.slice(0, 10).map((result: Article, idx: number) => (
              <li key={idx} className="flex items-center gap-4 py-2 border-b last:border-b-0">
                <span className="font-bold text-blue-600">{idx + 1}.</span>
                <span className="text-gray-700 w-32">{result.source}</span>
                <span className="text-gray-500 w-40">{result.date}</span>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline font-semibold flex-1"
                >
                  {result.title}
                </a>
              </li>
            ))
          )}
        </ul>
      )}
    </main>
  );
}
