"use client";

import { useState, type FormEvent } from "react";

type SearchResult = {
  content: string;
  score: number;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setSearched(false);

    try {
      const response = await fetch(`${apiBaseUrl}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = (await response.json()) as SearchResult[];
      setResults(data);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(217,119,6,0.18),_transparent_42%),linear-gradient(180deg,_#0f172a_0%,_#111827_52%,_#030712_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <section className="flex w-full max-w-3xl flex-col items-center gap-6 rounded-[2rem] border border-white/10 bg-white/6 p-5 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur md:p-8">
          <div className="w-full space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-amber-300/80">
                Semantic Search
              </p>
              <h1 className="mx-auto max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Search your Career Knowledge Base
              </h1>
            </div>

            <form onSubmit={handleSearch} className="mx-auto w-full max-w-2xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  placeholder="e.g. FastAPI experience, PostgreSQL projects..."
                  disabled={isLoading}
                  className="flex-1 rounded-2xl border border-white/15 bg-slate-950/35 px-5 py-4 text-white placeholder-slate-400 transition focus:border-amber-300/50 focus:outline-none focus:ring-2 focus:ring-amber-300/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="rounded-2xl bg-amber-300 px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-400"
                >
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>

            {error && (
              <div className="mx-auto w-full max-w-2xl rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            )}

            {searched && results.length === 0 && !isLoading && (
              <div className="mx-auto w-full max-w-2xl rounded-2xl border border-dashed border-white/10 px-4 py-8 text-sm text-slate-400">
                No results found for &ldquo;{query}&rdquo;
              </div>
            )}

            {results.length > 0 && (
              <div className="mx-auto w-full max-w-2xl space-y-4">
                <p className="text-sm text-slate-400">
                  Found {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
                        Score: {result.score.toFixed(2)}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                      {result.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}