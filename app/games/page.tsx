"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { CATEGORY_LIST } from "@/lib/categories";
import { PRODUCTS } from "@/lib/products";
import { PROFILES, inferGameProfile, rankByProfile } from "@/lib/recommend";
import type { GameSummary } from "@/lib/rawg-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function GamesPage() {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState<GameSummary[]>([]);
  const [game, setGame] = useState<GameSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setGame(null);
    try {
      const res = await fetch(`/api/games?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGames(data.games);
      if (data.games.length === 0) setError("Nenhum jogo encontrado. Tente outro nome.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar jogos.");
    } finally {
      setLoading(false);
    }
  }

  const result = game ? inferGameProfile(game.genres, game.tags) : null;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Hardware por jogo</h1>
        <p className="text-sm text-muted-foreground">
          Busque um jogo e veja quais produtos combinam melhor com o estilo dele.
        </p>
      </header>

      <form onSubmit={search} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex.: Counter-Strike 2, Dota 2, Cyberpunk 2077"
          className="h-10 flex-1 rounded-md border bg-card px-3 text-sm placeholder:text-muted-foreground"
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <Search />}
          Buscar
        </Button>
      </form>

      {error && <p className="rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p>}

      {games.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((g) => (
            <li key={g.id}>
              <button
                onClick={() => setGame(g)}
                aria-pressed={game?.id === g.id}
                className={`w-full overflow-hidden rounded-lg border bg-card text-left transition-colors hover:border-muted-foreground/40 ${
                  game?.id === g.id ? "border-primary" : ""
                }`}
              >
                {g.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={g.image} alt="" className="h-28 w-full object-cover" loading="lazy" />
                )}
                <div className="p-3">
                  <p className="font-medium leading-snug">{g.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{g.genres.join(", ") || "Sem gênero"}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {game && result && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Para {game.name}</h2>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge className={PROFILES[result.profile].className}>{PROFILES[result.profile].label}</Badge>
              {result.reason}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {CATEGORY_LIST.map(({ id, label, icon: Icon }) => {
              const top = rankByProfile(PRODUCTS[id], result.profile, result.kind).slice(0, 2);
              return (
                <div key={id} className="rounded-lg border bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-medium">
                      <Icon className="size-4 text-primary" />
                      {label}
                    </span>
                    <Link
                      href={`/compare?cat=${id}&ids=${top.map((p) => p.id).join(",")}`}
                      className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Comparar os 2
                    </Link>
                  </div>
                  <ol className="space-y-1.5 text-sm">
                    {top.map((p) => (
                      <li key={p.id}>
                        <span className="text-muted-foreground">{p.brand} </span>
                        {p.name}
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
