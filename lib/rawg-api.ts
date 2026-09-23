const BASE = "https://api.rawg.io/api";

export interface GameSummary {
  id: number;
  name: string;
  image: string | null;
  released: string | null;
  genres: string[];
  tags: string[];
}

/** Server-only: usa RAWG_API_KEY (chave gratuita, sem cartão). */
export async function searchGames(query: string, pageSize = 6): Promise<GameSummary[]> {
  const key = process.env.RAWG_API_KEY;
  if (!key) {
    throw new Error("RAWG_API_KEY não configurada. Crie uma chave grátis em rawg.io/apidocs e coloque no .env.local.");
  }

  const url = new URL(`${BASE}/games`);
  url.searchParams.set("key", key);
  url.searchParams.set("search", query);
  url.searchParams.set("page_size", String(pageSize));
  url.searchParams.set("search_precise", "true");

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`RAWG respondeu com status ${res.status}.`);

  const data = await res.json();
  return (data.results ?? []).map((g: any) => ({
    id: g.id,
    name: g.name,
    image: g.background_image ?? null,
    released: g.released ?? null,
    genres: (g.genres ?? []).map((x: any) => x.name),
    tags: (g.tags ?? []).filter((t: any) => t.language === "eng").map((t: any) => t.name),
  }));
}
