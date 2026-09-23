import { NextResponse } from "next/server";
import { searchGames } from "@/lib/rawg-api";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ games: [] });
  try {
    return NextResponse.json({ games: await searchGames(q) });
  } catch (e) {
    const error = e instanceof Error ? e.message : "Erro ao buscar jogos.";
    return NextResponse.json({ error }, { status: 500 });
  }
}
