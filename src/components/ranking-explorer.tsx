"use client";

import { useMemo, useState } from "react";
import type { RankingData } from "@/lib/vendedores-csv";
import type { Vendedor } from "@/types";

type Nivel = "todos" | "top" | "medio" | "riesgo";
type OrdenKey = "puntaje" | "vta_ov" | "prod" | "no_comp" | "lanzamientos" | "cobranza" | "relevamiento" | "nombre";
type Orden = `${OrdenKey}-${"desc" | "asc"}`;

type Ranked = Vendedor & { rank: number };

const ORDENES: { value: Orden; label: string }[] = [
  { value: "puntaje-desc", label: "Puntaje General (Desc)" },
  { value: "puntaje-asc", label: "Puntaje General (Asc)" },
  { value: "vta_ov-desc", label: "VTA / OV (Desc)" },
  { value: "prod-desc", label: "Productividad (Desc)" },
  { value: "no_comp-asc", label: "No Compradores (Asc)" },
  { value: "lanzamientos-desc", label: "Lanzamientos (Desc)" },
  { value: "cobranza-desc", label: "Cobranza (Desc)" },
  { value: "relevamiento-desc", label: "Relevamiento (Desc)" },
  { value: "nombre-asc", label: "Nombre (A-Z)" },
];

const NIVELES: { value: Nivel; label: string }[] = [
  { value: "todos", label: "Todos los Niveles" },
  { value: "top", label: "Top (≥85)" },
  { value: "medio", label: "Medio (70-84)" },
  { value: "riesgo", label: "Riesgo (<70)" },
];

const PAGE_SIZES = [10, 25, 50];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function nivelDe(puntaje: number): Exclude<Nivel, "todos"> {
  if (puntaje >= 85) return "top";
  if (puntaje >= 70) return "medio";
  return "riesgo";
}

function getTrendIcon(tendencia?: string) {
  if (tendencia?.startsWith("+")) {
    return <span className="inline-flex items-center text-success font-jetbrains text-[12px] leading-[16px]">▲ {tendencia}</span>;
  }
  if (tendencia?.startsWith("-")) {
    return <span className="inline-flex items-center text-error font-jetbrains text-[12px] leading-[16px]">▼ {tendencia}</span>;
  }
  return <span className="inline-flex items-center text-outline font-jetbrains text-[12px] leading-[16px]">= {tendencia || "0"}</span>;
}

const BADGE_BY_NIVEL = {
  top: "bg-primary/15 text-primary",
  medio: "bg-warning/15 text-warning",
  riesgo: "bg-error/10 text-error",
} as const;

function pageList(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("gap");
    result.push(p);
  });
  return result;
}

const selectClass =
  "appearance-none pl-9 pr-8 py-2 rounded-lg bg-surface text-on-surface shadow-sm text-[13px] leading-[18px] cursor-pointer hover:bg-surface-variant transition-colors focus:outline-none focus:ring-1 focus:ring-primary";

function SelectField({
  icon,
  label,
  value,
  onChange,
  children,
}: {
  icon: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="relative flex items-center">
      <span className="sr-only">{label}</span>
      <span aria-hidden className="material-symbols-outlined pointer-events-none absolute left-2.5 text-outline text-[18px]">
        {icon}
      </span>
      <select className={selectClass} value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
      <span aria-hidden className="material-symbols-outlined pointer-events-none absolute right-2 text-outline text-[16px]">
        expand_more
      </span>
    </label>
  );
}

const PODIO_STYLES = [
  {
    outline: "var(--color-primary)",
    glow: "0 0 20px -2px color-mix(in oklab, var(--color-primary) 25%, transparent)",
    gradient: "from-primary/10",
    accent: "text-primary",
  },
  {
    outline: "var(--color-secondary)",
    glow: "0 0 20px -2px color-mix(in oklab, var(--color-secondary) 35%, transparent)",
    gradient: "from-secondary/15",
    accent: "text-warning",
  },
  {
    outline: "var(--color-error)",
    glow: "0 0 20px -2px color-mix(in oklab, var(--color-error) 22%, transparent)",
    gradient: "from-error-container/20",
    accent: "text-error",
  },
];

function PodioCard({ v, idx, total }: { v: Ranked; idx: number; total: number }) {
  const style = PODIO_STYLES[idx];
  const kpis: [string, string, boolean?][] = [
    [`${v.vta_ov}%`, "VTA/OV"],
    [`${v.prod}`, "PROD"],
    [`${v.no_comp}%`, "NO COMP"],
    [`${v.lanzamientos}%`, "LANZ"],
    [`${v.no_entregados ?? 0}%`, "NO ENTR"],
    [`${v.cobranza}%`, "COBR"],
    [`${v.relevamiento}%`, "RELEV"],
    [`#${v.posicion_sucursal}`, "EN SUC", true],
  ];
  return (
    <div
      className="relative rounded-2xl bg-surface-container-low p-[1.25rem] flex flex-col overflow-hidden shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
      style={{ boxShadow: style.glow, outline: `1.5px solid ${style.outline}` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${style.gradient} via-transparent to-transparent pointer-events-none`} />
      <div className="relative z-10 flex flex-col">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[38px] font-bold leading-[42px] tracking-[-0.02em] text-on-surface">{v.puntaje}</span>
            <span className="font-jetbrains text-[9px] font-semibold leading-[12px] tracking-[0.08em] text-on-surface-variant uppercase mt-1">
              Puntaje
            </span>
          </div>
          <div className="flex flex-col items-end font-jetbrains text-[12px] leading-[16px] text-outline tracking-wider">
            <span>
              #{String(v.rank).padStart(2, "0")} <span className="text-surface-variant">/</span> {total}
            </span>
            {v.rank !== v.posicion_general && (
              <span className="text-[9px] tracking-[0.08em] uppercase">Gral #{v.posicion_general}</span>
            )}
          </div>
        </div>
        <div className="mt-[0.75rem]">
          <h2 className="text-[15px] font-bold leading-[22px] text-on-surface">
            {v.nombre} {v.apellido?.charAt(0)}.
          </h2>
          <p className="font-jetbrains text-[9px] leading-[12px] tracking-[0.08em] text-outline uppercase">
            {v.sucursal} · {v.plaza}
          </p>
        </div>
        <div className="my-[0.75rem] h-px w-full bg-surface-container-highest" />
        <div className="grid grid-cols-2 gap-y-[0.5rem] gap-x-[0.75rem]">
          {kpis.map(([value, label, accent]) => (
            <div key={label} className="flex items-baseline justify-between">
              <span className={`font-jetbrains text-[13px] font-bold leading-[16px] ${accent ? style.accent : "text-on-surface"}`}>
                {value}
              </span>
              <span className="font-jetbrains text-[9px] leading-[12px] tracking-[0.08em] text-outline uppercase">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RankingExplorer({ periodos }: { periodos: RankingData[] }) {
  const [periodo, setPeriodo] = useState(periodos[0]?.periodo ?? "");
  const [query, setQuery] = useState("");
  const [sucursal, setSucursal] = useState("todas");
  const [nivel, setNivel] = useState<Nivel>("todos");
  const [orden, setOrden] = useState<Orden>("puntaje-desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const actual = periodos.find((p) => p.periodo === periodo) ?? periodos[0];
  const vendedores = actual?.vendedores ?? [];

  const sucursales = useMemo(() => {
    const counts = new Map<string, number>();
    vendedores.forEach((v) => counts.set(v.sucursal ?? "", (counts.get(v.sucursal ?? "") ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [vendedores]);

  const filtrados = useMemo<Ranked[]>(() => {
    const q = normalize(query.trim());
    const matches = vendedores.filter((v) => {
      if (sucursal !== "todas" && v.sucursal !== sucursal) return false;
      if (nivel !== "todos" && nivelDe(v.puntaje) !== nivel) return false;
      if (!q) return true;
      const haystack = normalize([v.nombre, v.apellido, v.id, v.sucursal, v.zona, v.plaza].join(" "));
      return q.split(/\s+/).every((term) => haystack.includes(term));
    });

    const ranked = [...matches]
      .sort((a, b) => b.puntaje - a.puntaje)
      .map((v, idx) => ({ ...v, rank: idx + 1 }));

    const [key, dir] = orden.split("-") as [OrdenKey, "asc" | "desc"];
    const factor = dir === "asc" ? 1 : -1;
    return ranked.sort((a, b) => {
      if (key === "nombre") return factor * `${a.apellido} ${a.nombre}`.localeCompare(`${b.apellido} ${b.nombre}`, "es");
      return factor * (a[key] - b[key]) || a.rank - b.rank;
    });
  }, [vendedores, query, sucursal, nivel, orden]);

  const podio = useMemo(() => [...filtrados].sort((a, b) => a.rank - b.rank).slice(0, 3), [filtrados]);

  const totalPages = Math.max(1, Math.ceil(filtrados.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtrados.slice(start, start + pageSize);

  const promedio = filtrados.length
    ? (filtrados.reduce((s, v) => s + v.puntaje, 0) / filtrados.length).toFixed(1)
    : "0.0";
  const enObjetivo = filtrados.filter((v) => v.puntaje >= 70).length;
  const hasFilters = query !== "" || sucursal !== "todas" || nivel !== "todos" || orden !== "puntaje-desc" || periodo !== periodos[0]?.periodo;

  const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const limpiar = () => {
    setQuery("");
    setSucursal("todas");
    setNivel("todos");
    setOrden("puntaje-desc");
    setPeriodo(periodos[0]?.periodo ?? "");
    setPage(1);
  };

  const exportCsv = () => {
    const header = ["Pos", "ID", "Vendedor", "Sucursal", "Tipo", "Regional", "Puntaje", "VTA_OV", "Prod", "No_Comp", "Lanzamientos", "Cobranza", "Relevamiento"];
    const lines = filtrados.map((v) =>
      [v.rank, v.id, `${v.apellido} ${v.nombre}`, v.sucursal, v.plaza, v.zona, v.puntaje, v.vta_ov, v.prod, v.no_comp, v.lanzamientos, v.cobranza, v.relevamiento]
        .map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ranking-${actual?.periodo ?? "vendedores"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const chipBase = "px-3 py-1 rounded-full font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] uppercase transition-colors";

  return (
    <div className="flex flex-col w-full">
      {/* Top Header */}
      <div className="px-[1.75rem] py-[1.25rem] flex flex-col xl:flex-row xl:items-center justify-between gap-[1.25rem] bg-surface-container-lowest">
        <div className="flex flex-col gap-[0.25rem]">
          <div className="flex items-center gap-[0.5rem]">
            <h1 className="text-[24px] font-semibold leading-[32px] tracking-[-0.015em] text-on-surface">
              Ranking General de Vendedores
            </h1>
            <span className="px-[0.25rem] py-0.5 rounded font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] uppercase bg-primary/10 text-primary">
              {actual?.periodoLabel}
            </span>
          </div>
          <p className="text-[13px] leading-[18px] text-on-surface-variant">
            Métricas consolidadas de productividad comercial, efectividad de cobranza y cumplimiento de cuotas mensuales.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-[0.75rem]">
          <dl className="flex items-center gap-[1.25rem] px-[1.25rem] py-[0.5rem] rounded-lg bg-surface-container-low shadow-sm">
            {[
              { label: "Promedio", value: <>{promedio} <span className="text-[9px] font-normal text-outline">PTS</span></> },
              { label: "Meta Global", value: <span className="text-primary">{actual?.cumplimientoKilos ?? 0}%</span> },
              {
                label: "En Objetivo",
                value: (
                  <>
                    {enObjetivo}{" "}
                    <span className="text-[9px] font-normal text-primary">
                      ({filtrados.length ? Math.round((enObjetivo / filtrados.length) * 100) : 0}%)
                    </span>
                  </>
                ),
              },
              { label: "Vendedores", value: filtrados.length },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-[1.25rem]">
                {i > 0 && <div aria-hidden className="w-px h-6 bg-surface-variant" />}
                <div className="flex flex-col">
                  <dt className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] text-on-surface-variant uppercase">
                    {stat.label}
                  </dt>
                  <dd className="font-jetbrains text-[13px] font-bold leading-[16px] tracking-[-0.01em] text-on-surface">{stat.value}</dd>
                </div>
              </div>
            ))}
          </dl>
          <button
            type="button"
            onClick={exportCsv}
            className="flex items-center gap-[0.25rem] px-[0.75rem] py-[0.5rem] rounded-lg bg-secondary text-on-secondary hover:opacity-90 transition-opacity shadow-sm"
          >
            <span aria-hidden className="material-symbols-outlined text-[18px]">table_view</span>
            <span className="text-[13px] font-semibold leading-[18px]">Descargar CSV</span>
          </button>
        </div>
      </div>

      <div className="p-[1.75rem] flex flex-col gap-[1.75rem]">
        {/* Podio */}
        <section aria-label="Podio" className="flex flex-col gap-[0.75rem]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[0.5rem]">
              <span aria-hidden className="material-symbols-outlined text-primary text-[20px]">military_tech</span>
              <span className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] text-on-surface-variant uppercase">
                Podio · {sucursal === "todas" ? "Todas las sucursales" : sucursal}
              </span>
            </div>
            <span className="font-jetbrains text-[9px] leading-[12px] tracking-[0.08em] text-outline uppercase">
              {filtrados.length} representantes evaluados
            </span>
          </div>
          {podio.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.5rem]">
              {podio.map((v, idx) => (
                <PodioCard key={v.id} v={v} idx={idx} total={filtrados.length} />
              ))}
            </div>
          ) : (
            <p role="status" className="rounded-2xl bg-surface-container-low px-[1.25rem] py-[2rem] text-center text-[13px] text-on-surface-variant">
              Ningún vendedor coincide con los filtros seleccionados.
            </p>
          )}
        </section>

        {/* Filters */}
        <div className="bg-surface-container-low rounded-xl p-[1.25rem] flex flex-col gap-[0.75rem] shadow-md">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-[0.75rem]">
            <label className="relative flex-1 lg:min-w-[320px]">
              <span className="sr-only">Buscar vendedor</span>
              <span aria-hidden className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                search
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => resetPage(setQuery)(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface text-on-surface placeholder:text-outline text-[13px] leading-[18px] focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                placeholder="Buscar por vendedor, sucursal, ID o zona..."
              />
            </label>
            <div className="flex flex-wrap items-center gap-[0.5rem]">
              <SelectField icon="calendar_today" label="Período" value={periodo} onChange={resetPage(setPeriodo)}>
                {periodos.map((p, i) => (
                  <option key={p.periodo} value={p.periodo}>
                    {p.periodoLabel}
                    {i === 0 ? " (Mes Actual)" : ""}
                  </option>
                ))}
              </SelectField>
              <SelectField icon="sort" label="Orden" value={orden} onChange={(v) => resetPage(setOrden)(v as Orden)}>
                {ORDENES.map((o) => (
                  <option key={o.value} value={o.value}>
                    Orden: {o.label}
                  </option>
                ))}
              </SelectField>
              <SelectField icon="tune" label="Nivel" value={nivel} onChange={(v) => resetPage(setNivel)(v as Nivel)}>
                {NIVELES.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </SelectField>
              <button
                type="button"
                onClick={limpiar}
                disabled={!hasFilters}
                className="px-[0.75rem] py-2 rounded-lg bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors text-[13px] leading-[18px] flex items-center gap-[0.25rem] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span aria-hidden className="material-symbols-outlined text-[16px]">refresh</span>
                <span>Limpiar</span>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-[0.5rem] pt-[0.25rem]">
            <div role="group" aria-label="Filtrar por sucursal" className="flex flex-wrap items-center gap-[0.25rem]">
              <span className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] text-on-surface-variant uppercase pr-2">
                Sucursal:
              </span>
              {[["todas", vendedores.length] as const, ...sucursales].map(([name, count]) => {
                const active = sucursal === name;
                return (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={active}
                    onClick={() => resetPage(setSucursal)(name)}
                    className={`${chipBase} ${
                      active
                        ? "bg-primary text-on-primary"
                        : "bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    {name === "todas" ? "Todas" : name} ({count})
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-[0.75rem]">
              {(["top", "medio", "riesgo"] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={nivel === n}
                  onClick={() => resetPage(setNivel)(nivel === n ? "todos" : n)}
                  className={`flex items-center gap-2 rounded-full px-2 py-0.5 transition-colors ${nivel === n ? "bg-surface-container-high" : "hover:bg-surface"}`}
                >
                  <span
                    className={`inline-flex w-2.5 h-2.5 rounded-full ${n === "top" ? "bg-primary" : n === "medio" ? "bg-secondary" : "bg-error"}`}
                  />
                  <span className="font-jetbrains text-[9px] leading-[12px] tracking-[0.08em] text-on-surface-variant">
                    {NIVELES.find((x) => x.value === n)?.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-container-low rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="h-10 bg-surface-container text-on-surface-variant font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] uppercase">
                  <th className="px-[0.75rem] text-center w-14"># Pos</th>
                  <th className="px-[0.75rem] text-center w-16">Tend.</th>
                  <th className="px-[0.75rem]">Vendedor / Plaza</th>
                  <th className="px-[0.75rem]">Zona</th>
                  <th className="px-[0.75rem] text-right">Puntaje</th>
                  <th className="px-[0.75rem] text-right">VTA / OV</th>
                  <th className="px-[0.75rem] text-right">Prod</th>
                  <th className="px-[0.75rem] text-right">No Comp</th>
                  <th className="px-[0.75rem] text-right">Lanzamientos</th>
                  <th className="px-[0.75rem] text-right">Cobranza</th>
                  <th className="px-[0.75rem] text-right">Relevamiento</th>
                  <th className="px-[0.75rem] text-center">En Suc.</th>
                </tr>
              </thead>
              <tbody className="text-on-surface text-[13px] leading-[18px]">
                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={12} className="px-[0.75rem] py-[2rem] text-center text-on-surface-variant">
                      Sin resultados. Probá con otra búsqueda o limpiá los filtros.
                    </td>
                  </tr>
                )}
                {pageRows.map((v, idx) => {
                  const badge = BADGE_BY_NIVEL[nivelDe(v.puntaje)];
                  const initials = `${v.nombre?.charAt(0) || ""}${v.apellido?.charAt(0) || ""}`;
                  return (
                    <tr
                      key={v.id}
                      className={`h-12 ${idx % 2 === 0 ? "bg-surface-container-low" : "bg-surface-container/20"} hover:bg-surface-variant/40 transition-colors`}
                    >
                      <td className="px-[0.75rem] text-center">
                        <div className="flex flex-col items-center">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-jetbrains text-[13px] font-bold leading-[16px] ${badge}`}>
                            {String(v.rank).padStart(2, "0")}
                          </span>
                          {v.rank !== v.posicion_general && (
                            <span className="font-jetbrains text-[9px] leading-[12px] text-outline">Gral #{v.posicion_general}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-[0.75rem] text-center">{getTrendIcon(v.tendencia)}</td>
                      <td className="px-[0.75rem]">
                        <div className="flex items-center gap-[0.5rem]">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-jetbrains text-[13px] font-bold leading-[16px] ${badge}`}>
                            {initials}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[15px] font-bold leading-[22px] text-on-surface">
                              {v.nombre} {v.apellido}
                            </span>
                            <span className="font-jetbrains text-[9px] leading-[12px] tracking-[0.08em] text-outline uppercase">
                              {v.id} · {v.sucursal} · {v.plaza}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-[0.75rem]">
                        <span className="font-jetbrains text-[9px] leading-[12px] tracking-[0.08em] uppercase px-2 py-0.5 rounded bg-surface text-on-surface-variant">
                          {v.zona || "N/A"}
                        </span>
                      </td>
                      <td className="px-[0.75rem] text-right">
                        <span className={`inline-block px-2.5 py-1 rounded-md font-jetbrains text-[13px] font-bold leading-[16px] whitespace-nowrap ${badge}`}>
                          {v.puntaje} PTS
                        </span>
                      </td>
                      <td className="px-[0.75rem] text-right font-jetbrains font-bold">{v.vta_ov}%</td>
                      <td className="px-[0.75rem] text-right font-jetbrains font-bold">{v.prod}</td>
                      <td className="px-[0.75rem] text-right font-jetbrains text-on-surface-variant">{v.no_comp}%</td>
                      <td className="px-[0.75rem] text-right font-jetbrains font-bold">{v.lanzamientos}%</td>
                      <td className="px-[0.75rem] text-right font-jetbrains font-bold">{v.cobranza}%</td>
                      <td className="px-[0.75rem] text-right font-jetbrains font-bold">{v.relevamiento}%</td>
                      <td className="px-[0.75rem] text-center font-jetbrains font-bold">#{v.posicion_sucursal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-[1.25rem] py-[0.75rem] bg-surface-container flex flex-col md:flex-row items-center justify-between gap-[0.75rem]">
            <div className="flex flex-wrap items-center gap-[1.25rem]">
              <span className="text-[13px] leading-[18px] text-on-surface-variant">
                Mostrando{" "}
                <span className="text-on-surface font-jetbrains font-bold">
                  {filtrados.length ? `${start + 1}-${start + pageRows.length}` : "0"}
                </span>{" "}
                de <span className="text-on-surface font-jetbrains font-bold">{filtrados.length}</span> vendedores
              </span>
              <label className="flex items-center gap-[0.25rem] text-on-surface-variant">
                <span className="font-jetbrains text-[9px] leading-[12px] tracking-[0.08em] uppercase">Filas por página:</span>
                <select
                  value={pageSize}
                  onChange={(e) => resetPage(setPageSize)(Number(e.target.value))}
                  className="px-2 py-0.5 rounded bg-surface text-on-surface font-jetbrains text-[13px] font-bold cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {PAGE_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <nav aria-label="Paginación" className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Página anterior"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className="w-8 h-8 rounded flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span aria-hidden className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              {pageList(currentPage, totalPages).map((p, i) =>
                p === "gap" ? (
                  <span key={`gap-${i}`} className="px-2 text-outline font-jetbrains text-[9px]">...</span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    aria-current={p === currentPage ? "page" : undefined}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded font-jetbrains text-[12px] font-bold flex items-center justify-center transition-colors ${
                      p === currentPage
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-variant"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                type="button"
                aria-label="Página siguiente"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
                className="w-8 h-8 rounded flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span aria-hidden className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
