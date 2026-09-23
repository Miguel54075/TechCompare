import { Headphones, Keyboard, Cpu, Monitor, Mouse, type LucideIcon } from "lucide-react";
import type { CategoryId } from "./types";

export interface SpecDef {
  key: string;
  label: string;
  unit?: string;
  prefix?: string;
  type: "number" | "text" | "list";
  /**
   * higher/lower: o melhor valor ganha destaque verde.
   * ranked: usa a ordem de `rank` (pior → melhor).
   * none: comparação neutra, sem vencedor.
   */
  better: "higher" | "lower" | "ranked" | "none";
  rank?: string[];
  hint?: string;
}

export interface CategoryDef {
  id: CategoryId;
  label: string;
  singular: string;
  description: string;
  icon: LucideIcon;
  /** Specs mostradas no card do produto */
  highlights: string[];
  specs: SpecDef[];
}

const price: SpecDef = {
  key: "price_usd",
  label: "Preço de lançamento",
  prefix: "US$ ",
  type: "number",
  better: "lower",
  hint: "Valor de referência (MSRP). Atualize no JSON.",
};

export const CATEGORIES: Record<CategoryId, CategoryDef> = {
  mice: {
    id: "mice",
    label: "Mouses",
    singular: "mouse",
    description: "Sensor, DPI, polling rate e peso.",
    icon: Mouse,
    highlights: ["dpi_max", "polling_hz", "weight_g"],
    specs: [
      { key: "sensor_type", label: "Tipo de sensor", type: "text", better: "none" },
      { key: "sensor_model", label: "Modelo do sensor", type: "text", better: "none" },
      { key: "dpi_max", label: "DPI máximo", type: "number", better: "higher" },
      { key: "polling_hz", label: "Polling rate", unit: "Hz", type: "number", better: "higher" },
      { key: "weight_g", label: "Peso", unit: "g", type: "number", better: "lower" },
      { key: "connection", label: "Conexão", type: "text", better: "none" },
      { key: "ideal_for", label: "Ideal para", type: "list", better: "none" },
      price,
    ],
  },
  keyboards: {
    id: "keyboards",
    label: "Teclados",
    singular: "teclado",
    description: "Switch, feedback, força de atuação e ruído.",
    icon: Keyboard,
    highlights: ["switch_type", "feedback", "noise_dba"],
    specs: [
      { key: "switch_type", label: "Tipo de switch", type: "text", better: "none" },
      { key: "switch_name", label: "Switch", type: "text", better: "none" },
      { key: "feedback", label: "Feedback", type: "text", better: "none" },
      {
        key: "actuation_force_g",
        label: "Força de atuação",
        unit: "g",
        type: "number",
        better: "none",
        hint: "Menor = mais rápido, maior = menos digitação acidental.",
      },
      {
        key: "noise_dba",
        label: "Ruído estimado",
        unit: "dBA",
        type: "number",
        better: "lower",
        hint: "Estimativa por tipo de switch.",
      },
      { key: "layout", label: "Formato", type: "text", better: "none" },
      { key: "connection", label: "Conexão", type: "text", better: "none" },
      price,
    ],
  },
  headsets: {
    id: "headsets",
    label: "Headsets",
    singular: "headset",
    description: "Driver, impedância, isolamento e microfone.",
    icon: Headphones,
    highlights: ["driver_mm", "noise_isolation", "mic_quality"],
    specs: [
      { key: "driver_mm", label: "Tamanho do driver", unit: "mm", type: "number", better: "higher" },
      {
        key: "impedance_ohm",
        label: "Impedância",
        unit: "Ω",
        type: "number",
        better: "none",
        hint: "Menor = mais fácil de alimentar (celular, notebook).",
      },
      {
        key: "noise_isolation",
        label: "Isolamento de ruído",
        type: "text",
        better: "ranked",
        rank: ["Passivo", "ANC"],
      },
      {
        key: "mic_quality",
        label: "Qualidade do microfone",
        unit: "/ 10",
        type: "number",
        better: "higher",
        hint: "Nota subjetiva baseada em reviews.",
      },
      { key: "connection", label: "Conexão", type: "text", better: "none" },
      price,
    ],
  },
  gpus: {
    id: "gpus",
    label: "Placas de vídeo",
    singular: "placa de vídeo",
    description: "VRAM, TFLOPS, consumo e ruído.",
    icon: Cpu,
    highlights: ["vram_gb", "tflops", "tdp_w"],
    specs: [
      { key: "vram_gb", label: "VRAM", unit: "GB", type: "number", better: "higher" },
      { key: "memory_type", label: "Tipo de memória", type: "text", better: "none" },
      { key: "tflops", label: "Desempenho FP32", unit: "TFLOPS", type: "number", better: "higher" },
      { key: "tdp_w", label: "Consumo (TDP)", unit: "W", type: "number", better: "lower" },
      {
        key: "noise_dba",
        label: "Ruído sob stress",
        unit: "dBA",
        type: "number",
        better: "lower",
        hint: "Varia bastante conforme o modelo do fabricante.",
      },
      price,
    ],
  },
  monitors: {
    id: "monitors",
    label: "Monitores",
    singular: "monitor",
    description: "Taxa de atualização, resposta e painel.",
    icon: Monitor,
    highlights: ["panel_type", "refresh_hz", "response_ms"],
    specs: [
      {
        key: "panel_type",
        label: "Tipo de painel",
        type: "text",
        better: "ranked",
        rank: ["TN", "VA", "IPS", "OLED"],
        hint: "Ordem por qualidade de imagem, não por velocidade.",
      },
      { key: "refresh_hz", label: "Taxa de atualização", unit: "Hz", type: "number", better: "higher" },
      { key: "response_ms", label: "Tempo de resposta", unit: "ms", type: "number", better: "lower" },
      {
        key: "resolution",
        label: "Resolução",
        type: "text",
        better: "ranked",
        rank: ["1920x1080", "2560x1440", "3440x1440"],
      },
      { key: "size_in", label: "Tamanho", unit: "pol", type: "number", better: "none" },
      price,
    ],
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
export const isCategoryId = (v: string | null | undefined): v is CategoryId =>
  !!v && v in CATEGORIES;
