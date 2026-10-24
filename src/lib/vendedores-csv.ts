import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { Vendedor } from "@/types";

const CSV_PATH = path.join(process.cwd(), "Shippear3_Dataset_Ranking_Vendedores.xlsx - Dataset.csv");

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

type Row = Record<string, string>;

function parseCsv(text: string): Row[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  row.push(field);
  if (row.some((cell) => cell.trim() !== "")) rows.push(row);

  const [header, ...data] = rows;
  return data.map((cells) =>
    Object.fromEntries(header.map((key, idx) => [key.trim(), (cells[idx] ?? "").trim()])),
  );
}

function toNumber(value: string): number {
  const n = Number.parseFloat(value.replace(/[%,]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

const clamp = (n: number) => Math.max(0, Math.min(100, n));
const round1 = (n: number) => Math.round(n * 10) / 10;

// Weighted score (0-100). Lower-is-better KPIs (no compradores) are inverted.
function calcularPuntaje(k: {
  vta: number; prod: number; noComp: number; lanz: number; cobr: number; relev: number;
}) {
  const scores = [
    { w: 0.3, s: clamp((k.vta / 110) * 100) },
    { w: 0.15, s: clamp((k.prod / 70) * 100) },
    { w: 0.15, s: clamp(100 - k.noComp * 5) },
    { w: 0.1, s: clamp((k.lanz / 40) * 100) },
    { w: 0.2, s: clamp(k.cobr) },
    { w: 0.1, s: clamp(k.relev) },
  ];
  return round1(scores.reduce((sum, { w, s }) => sum + w * s, 0));
}

export interface RankingData {
  vendedores: Vendedor[];
  periodo: string;
  periodoLabel: string;
  cumplimientoKilos: number;
}

export const getRanking = cache(async (): Promise<RankingData> => {
  const text = await readFile(CSV_PATH, "utf8");
  const rows = parseCsv(text);

  const meses = [...new Set(rows.map((r) => r.Mes))].sort();
  const periodo = meses.at(-1) ?? "";
  const periodoAnterior = meses.at(-2);

  const puntajeDe = (r: Row) =>
    calcularPuntaje({
      vta: toNumber(r.KPI_Venta_vs_OV),
      prod: toNumber(r.KPI_Productividad),
      noComp: toNumber(r.KPI_No_Compradores),
      lanz: toNumber(r.KPI_Ult_Lanzamientos),
      cobr: toNumber(r.KPI_Cobranzas),
      relev: toNumber(r.KPI_Relevamientos),
    });

  const puntajesPrevios = new Map(
    rows.filter((r) => r.Mes === periodoAnterior).map((r) => [r.ID_Vendedor, puntajeDe(r)]),
  );

  const actuales = rows.filter((r) => r.Mes === periodo);

  const vendedores: Vendedor[] = actuales
    .map((r) => {
      const [apellido = "", ...resto] = r.Vendedor.split(" ");
      const puntaje = puntajeDe(r);
      const previo = puntajesPrevios.get(r.ID_Vendedor);
      const diff = previo === undefined ? 0 : round1(puntaje - previo);
      return {
        id: r.ID_Vendedor,
        nombre: resto.join(" "),
        apellido,
        sucursal: r.Sucursal,
        plaza: r.Tipo_Vendedor,
        zona: r.Regional,
        puntaje,
        vta_ov: toNumber(r.KPI_Venta_vs_OV),
        prod: toNumber(r.KPI_Productividad),
        no_comp: toNumber(r.KPI_No_Compradores),
        lanzamientos: toNumber(r.KPI_Ult_Lanzamientos),
        cobranza: toNumber(r.KPI_Cobranzas),
        relevamiento: toNumber(r.KPI_Relevamientos),
        posicion_sucursal: 0,
        posicion_general: 0,
        tendencia: diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : "0",
        periodo,
      };
    })
    .sort((a, b) => b.puntaje - a.puntaje);

  const contadorSucursal = new Map<string, number>();
  vendedores.forEach((v, idx) => {
    v.posicion_general = idx + 1;
    const pos = (contadorSucursal.get(v.sucursal ?? "") ?? 0) + 1;
    contadorSucursal.set(v.sucursal ?? "", pos);
    v.posicion_sucursal = pos;
  });

  const objetivo = actuales.reduce((s, r) => s + toNumber(r.Kilos_Objetivo), 0);
  const vendidos = actuales.reduce((s, r) => s + toNumber(r.Kilos_Vendidos), 0);

  const [anio, mes] = periodo.split("-");
  const periodoLabel = mes ? `${MESES[Number(mes) - 1]} ${anio}` : periodo;

  return {
    vendedores,
    periodo,
    periodoLabel,
    cumplimientoKilos: objetivo > 0 ? round1((vendidos / objetivo) * 100) : 0,
  };
});
