import { Briefcase, Crosshair, Film, Sparkles, type LucideIcon } from "lucide-react";
import { CATEGORIES, type SpecDef } from "./categories";
import { getProductValue } from "./products";
import type { CategoryId, Product, ProfileId, SpecValue } from "./types";

export const PROFILES: Record<ProfileId, { label: string; icon: LucideIcon; className: string }> = {
  productivity: {
    label: "Produtividade",
    icon: Briefcase,
    className: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  },
  competitive: {
    label: "Competitivo (FPS)",
    icon: Crosshair,
    className: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  },
  immersion: {
    label: "Imersão (Single-player)",
    icon: Sparkles,
    className: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  },
  editing: {
    label: "Edição",
    icon: Film,
    className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },
};

export const PROFILE_IDS = Object.keys(PROFILES) as ProfileId[];

/**
 * Pesos por perfil. Peso positivo: quanto MAIOR o valor, melhor para o perfil.
 * Peso negativo: quanto MENOR, melhor. Só os pesos importam, não a direção "better" da tabela.
 */
const WEIGHTS: Record<CategoryId, Record<ProfileId, Record<string, number>>> = {
  mice: {
    competitive: { weight_g: -3, polling_hz: 2, dpi_max: 1 },
    productivity: { weight_g: 1 },
    immersion: { dpi_max: 1 },
    editing: { dpi_max: 1, weight_g: 1 },
  },
  keyboards: {
    competitive: { actuation_force_g: -2, noise_dba: -0.5 },
    productivity: { noise_dba: -2 },
    immersion: { noise_dba: -1 },
    editing: { noise_dba: -1.5 },
  },
  headsets: {
    competitive: { mic_quality: 2, driver_mm: 1 },
    productivity: { noise_isolation: 2, mic_quality: 2 },
    immersion: { driver_mm: 2, noise_isolation: 2 },
    editing: { driver_mm: 1, impedance_ohm: 1 },
  },
  gpus: {
    competitive: { tflops: 1.5, vram_gb: 0.5 },
    productivity: { tdp_w: -2, noise_dba: -2, vram_gb: 0.5 },
    immersion: { tflops: 2, vram_gb: 1.5 },
    editing: { vram_gb: 2.5, tflops: 1.5 },
  },
  monitors: {
    competitive: { refresh_hz: 3, response_ms: -3 },
    productivity: { resolution: 2, size_in: 1 },
    immersion: { panel_type: 3, resolution: 2 },
    editing: { panel_type: 2, resolution: 2 },
  },
};

/** Normaliza um valor para 0..1 dentro do conjunto da categoria. */
function normalize(def: SpecDef, value: SpecValue | undefined, all: (SpecValue | undefined)[]): number {
  if (typeof value === "number") {
    const nums = all.filter((v): v is number => typeof v === "number");
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    return max === min ? 0.5 : (value - min) / (max - min);
  }
  if (def.rank && typeof value === "string" && def.rank.length > 1) {
    return Math.max(0, def.rank.indexOf(value)) / (def.rank.length - 1);
  }
  return 0.5;
}

/** Pontuação 0..1: 65% specs (relativas à categoria) + 35% dica manual. */
export function profileScore(p: Product, all: Product[], profile: ProfileId): number {
  const cat = CATEGORIES[p.category];
  const weights = WEIGHTS[p.category][profile] ?? {};
  let total = 0;
  let sum = 0;
  for (const [key, w] of Object.entries(weights)) {
    const def = cat.specs.find((s) => s.key === key);
    if (!def) continue;
    const n = normalize(def, getProductValue(p, key), all.map((x) => getProductValue(x, key)));
    total += (w > 0 ? n : 1 - n) * Math.abs(w);
    sum += Math.abs(w);
  }
  const specScore = sum ? total / sum : 0.5;
  const hint = p.profile_hints?.includes(profile) ? 1 : 0;
  return 0.65 * specScore + 0.35 * hint;
}

/** Tags "Recomendado para": até `max` perfis acima do limiar (sempre pelo menos 1). */
export function getRecommendedTags(p: Product, all: Product[], max = 2): ProfileId[] {
  const scored = PROFILE_IDS.map((id) => ({ id, s: profileScore(p, all, id) })).sort((a, b) => b.s - a.s);
  const picked = scored.filter((x) => x.s >= 0.55).slice(0, max);
  return (picked.length ? picked : scored.slice(0, 1)).map((x) => x.id);
}

/** Ranking por perfil; `kind` (FPS/MOBA) dá um pequeno bônus a quem declara "ideal_for". */
export function rankByProfile(products: Product[], profile: ProfileId, kind?: string): Product[] {
  const score = (p: Product) => {
    const ideal = p.specs.ideal_for;
    const bonus = kind && Array.isArray(ideal) && ideal.includes(kind) ? 0.15 : 0;
    return profileScore(p, products, profile) + bonus;
  };
  return [...products].sort((a, b) => score(b) - score(a));
}

/** Traduz gêneros/tags do RAWG em um perfil de hardware. */
export function inferGameProfile(genres: string[], tags: string[]): {
  profile: ProfileId;
  kind?: "FPS" | "MOBA";
  reason: string;
} {
  const text = [...genres, ...tags].map((t) => t.toLowerCase());
  const has = (...needles: string[]) => text.some((t) => needles.some((n) => t.includes(n)));

  const moba = has("moba");
  const fps = has("fps", "shooter");
  const competitiveSignals = has("esports", "competitive", "pvp", "multiplayer", "moba");
  const singleSignals = has("singleplayer", "story rich", "atmospheric", "open world", "rpg", "adventure");

  if (moba) return { profile: "competitive", kind: "MOBA", reason: "Jogo MOBA: resposta rápida e precisão." };
  if (fps && competitiveSignals)
    return { profile: "competitive", kind: "FPS", reason: "FPS competitivo: mouse leve, alto refresh e baixa latência." };
  if (competitiveSignals && !singleSignals)
    return { profile: "competitive", reason: "Foco em multiplayer competitivo." };
  if (singleSignals)
    return { profile: "immersion", reason: "Jogo single-player: qualidade de imagem e áudio importam mais." };
  if (has("fighting", "sports", "racing"))
    return { profile: "competitive", reason: "Gênero que valoriza tempo de reação." };
  return { profile: "immersion", reason: "Perfil geral, priorizando experiência visual." };
}
