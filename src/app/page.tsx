import { supabase } from "@/lib/supabase";
import { Vendedor } from "@/types";

async function getVendedores(): Promise<Vendedor[]> {
  try {
    const { data, error } = await supabase
      .from("vendedores")
      .select("*")
      .order("posicion_general", { ascending: true });

    if (error) {
      console.error("Error fetching vendedores:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

function getTrendIcon(tendencia?: string) {
  if (tendencia?.startsWith("+")) {
    return (
      <span className="inline-flex items-center text-primary font-mono text-[12px] font-normal leading-[16px]">
        ▲ {tendencia}
      </span>
    );
  }
  if (tendencia?.startsWith("-")) {
    return (
      <span className="inline-flex items-center text-error font-mono text-[12px] font-normal leading-[16px]">
        ▼ {tendencia}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-outline font-mono text-[12px] font-normal leading-[16px]">
      = {tendencia || "0"}
    </span>
  );
}

function getScoreBadgeClass(puntaje: number) {
  if (puntaje >= 85) {
    return "bg-primary/15 text-primary";
  }
  if (puntaje >= 70) {
    return "bg-secondary/20 text-secondary";
  }
  return "bg-error-container/40 text-error";
}

export default async function Home() {
  const vendedores = await getVendedores();
  const top3 = vendedores.slice(0, 3);
  const tableData = vendedores.slice(0, 10);

  const promedioGeneral =
    vendedores.length > 0
      ? (vendedores.reduce((sum, v) => sum + v.puntaje, 0) / vendedores.length).toFixed(1)
      : "0.0";
  const enObjetivo = vendedores.filter((v) => v.puntaje >= 70).length;
  const metaGlobal = "102.3%";

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest z-50 flex flex-col justify-between py-[1.25rem]">
        <div className="flex flex-col gap-[1.75rem]">
          <div className="px-[1.25rem] flex items-center gap-[0.5rem]">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">query_stats</span>
            </div>
            <div className="flex flex-col">
              <span className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] text-on-surface uppercase">
                La Virginia
              </span>
              <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-on-surface-variant uppercase">
                Gestión Comercial
              </span>
            </div>
          </div>
          <nav className="flex flex-col gap-[0.25rem] px-[0.75rem]">
            <div className="px-[0.75rem] py-[0.25rem]">
              <span className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] text-on-surface-variant uppercase">
                Análisis Comercial
              </span>
            </div>
            <a
              aria-current="page"
              className="flex items-center gap-[0.75rem] px-[0.75rem] py-[0.5rem] rounded-lg transition-colors bg-primary-container text-on-primary-container font-semibold"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">leaderboard</span>
              <span className="text-[13px] font-medium leading-[18px]">Ranking General</span>
            </a>
            <a
              className="flex items-center gap-[0.75rem] px-[0.75rem] py-[0.5rem] rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">target</span>
              <span className="text-[13px] font-normal leading-[18px]">Cuotas y Objetivos</span>
            </a>
            <a
              className="flex items-center gap-[0.75rem] px-[0.75rem] py-[0.5rem] rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">public</span>
              <span className="text-[13px] font-normal leading-[18px]">Rendimiento Regional</span>
            </a>
            <a
              className="flex items-center gap-[0.75rem] px-[0.75rem] py-[0.5rem] rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">monitoring</span>
              <span className="text-[13px] font-normal leading-[18px]">Telemetría Vendedores</span>
            </a>
            <div className="mt-[0.75rem] px-[0.75rem] py-[0.25rem]">
              <span className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] text-on-surface-variant uppercase">
                Estrategia
              </span>
            </div>
            <a
              className="flex items-center gap-[0.75rem] px-[0.75rem] py-[0.5rem] rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span className="text-[13px] font-normal leading-[18px]">Pipeline & Riesgos</span>
            </a>
            <a
              className="flex items-center gap-[0.75rem] px-[0.75rem] py-[0.5rem] rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">payments</span>
              <span className="text-[13px] font-normal leading-[18px]">Comisiones</span>
            </a>
          </nav>
        </div>
        <div className="px-[0.75rem]">
          <div className="p-[0.75rem] rounded-lg bg-surface-container-low flex flex-col gap-[0.25rem]">
            <div className="flex items-center justify-between">
              <span className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] text-on-surface-variant uppercase">
                Sync Engine
              </span>
              <span className="w-2 h-2 rounded-full bg-primary"></span>
            </div>
            <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-on-surface">
              Latency 14ms · CRM Sync OK
            </span>
          </div>
        </div>
      </aside>

      <div className="pl-64 w-full">
        {/* Header */}
        <header className="fixed top-0 left-64 right-0 z-40 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="h-16 w-full px-[1.25rem] flex items-center justify-between gap-[1.25rem]">
            <div className="flex items-center gap-[1.25rem]">
              <div className="flex items-baseline gap-[0.25rem]">
                <span className="text-[18px] font-semibold leading-[24px] tracking-[-0.01em] text-on-surface">
                  La Virginia
                </span>
                <span className="text-[18px] font-semibold leading-[24px] tracking-[-0.01em] text-outline-variant">
                  /
                </span>
                <span className="text-[18px] font-normal leading-[24px] tracking-[-0.01em] text-on-surface-variant">
                  Ranking Comercial
                </span>
              </div>
              <div className="hidden xl:flex items-center gap-[0.25rem] px-[0.75rem] py-[0.25rem] rounded-full bg-surface-container text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] uppercase">
                  Octubre 2024 · En Vivo · {vendedores.length} Vendedores
                </span>
              </div>
            </div>
            <div className="flex-1 max-w-md hidden md:flex items-center">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-[0.25rem] rounded-lg bg-surface text-on-surface placeholder:text-outline text-[13px] font-normal leading-[18px] focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Buscar vendedor, plaza o indicador (Cmd + K)..."
                  type="text"
                />
              </div>
            </div>
            <div className="flex items-center gap-[0.75rem]">
              <button className="flex items-center gap-[0.25rem] px-[0.75rem] py-[0.25rem] rounded-lg bg-primary-container text-on-primary-container transition-opacity hover:opacity-90">
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span className="text-[13px] font-medium leading-[18px]">Exportar Reporte</span>
              </button>
              <button className="p-[0.25rem] rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
              </button>
              <button className="relative p-[0.25rem] rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
            </div>
          </div>
        </header>

        <main className="w-full pt-16 bg-surface min-h-screen">
          <div className="flex flex-col w-full">
            {/* Top Header */}
            <div className="px-[1.75rem] py-[1.25rem] flex flex-col xl:flex-row xl:items-center justify-between gap-[1.25rem] bg-surface-container-lowest">
              <div className="flex flex-col gap-[0.25rem]">
                <div className="flex items-center gap-[0.5rem]">
                  <h1 className="text-[24px] font-semibold leading-[32px] tracking-[-0.015em] text-on-surface font-semibold">
                    Ranking General de Vendedores
                  </h1>
                  <span className="px-[0.25rem] py-0.5 rounded font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] uppercase bg-primary/10 text-primary">
                    Periodo Fiscal ACTIVO
                  </span>
                </div>
                <p className="text-[13px] font-normal leading-[18px] text-on-surface-variant">
                  Métricas consolidadas de productividad comercial, efectividad de cobranza y cumplimiento de cuotas mensuales.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-[0.75rem]">
                <div className="flex items-center gap-[1.25rem] px-[1.25rem] py-[0.5rem] rounded-lg bg-surface-container-low shadow-sm">
                  <div className="flex flex-col">
                    <span className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] text-on-surface-variant uppercase">
                      Promedio General
                    </span>
                    <span className="font-jetbrains text-[13px] font-bold leading-[16px] tracking-[-0.01em] text-on-surface">
                      {promedioGeneral} <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline">PTS</span>
                    </span>
                  </div>
                  <div className="w-px h-6 bg-surface-variant"></div>
                  <div className="flex flex-col">
                    <span className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] text-on-surface-variant uppercase">
                      Meta Global
                    </span>
                    <span className="font-jetbrains text-[13px] font-bold leading-[16px] tracking-[-0.01em] text-primary">
                      {metaGlobal}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-surface-variant"></div>
                  <div className="flex flex-col">
                    <span className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] text-on-surface-variant uppercase">
                      En Objetivo
                    </span>
                    <span className="font-jetbrains text-[13px] font-bold leading-[16px] tracking-[-0.01em] text-on-surface">
                      {enObjetivo} <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-primary">({Math.round((enObjetivo / vendedores.length) * 100)}%)</span>
                    </span>
                  </div>
                  <div className="w-px h-6 bg-surface-variant"></div>
                  <div className="flex flex-col">
                    <span className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] text-on-surface-variant uppercase">
                      Vendedores
                    </span>
                    <span className="font-jetbrains text-[13px] font-bold leading-[16px] tracking-[-0.01em] text-on-surface">
                      {vendedores.length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-[0.5rem]">
                  <button className="flex items-center gap-[0.25rem] px-[0.75rem] py-[0.5rem] rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">cloud_download</span>
                    <span className="text-[13px] font-normal leading-[18px]">Comparar Períodos</span>
                  </button>
                  <button className="flex items-center gap-[0.25rem] px-[0.75rem] py-[0.5rem] rounded-lg bg-primary-container text-on-primary-container hover:opacity-90 transition-opacity shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">table_view</span>
                    <span className="text-[13px] font-semibold leading-[18px]">Descargar Excel/CSV</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-[1.75rem] flex flex-col gap-[1.75rem]">
              {/* Podio */}
              <section className="flex flex-col gap-[0.75rem]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[0.5rem]">
                    <span className="material-symbols-outlined text-primary text-[20px]">military_tech</span>
                    <span className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] text-on-surface-variant uppercase">
                      Monitoreo de Extremos · Podio & Alerta de Desempeño
                    </span>
                  </div>
                  <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline">
                    CRITERIO: {vendedores.length} REPRESENTANTES EVALUADOS · VINCULADO AL CRM
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.5rem]">
                  {top3.map((v, idx) => {
                    const position = idx + 1;
                    if (position === 1) {
                      return (
                        <div
                          key={v.id}
                          className="relative rounded-2xl bg-surface-container-low p-[1.25rem] flex flex-col justify-between overflow-hidden shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                          style={{
                            boxShadow: "0 0 20px -2px rgba(75, 226, 119, 0.28), inset 0 0 16px -4px rgba(75, 226, 119, 0.15)",
                            outline: "1.5px solid #4be277",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none"></div>
                          <div className="relative z-10 flex flex-col">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col">
                                <span className="text-[38px] font-bold leading-[42px] tracking-[-0.02em] text-white">
                                  {v.puntaje}
                                </span>
                                <span className="font-jetbrains text-[9px] font-semibold leading-[12px] tracking-[0.08em] text-on-surface-variant uppercase mt-1">
                                  PUNTAJE
                                </span>
                              </div>
                              <div className="font-jetbrains text-[12px] font-normal leading-[16px] text-outline tracking-wider">
                                #{String(v.posicion_general || position).padStart(2, "0")}{" "}
                                <span className="text-surface-variant">/</span> {vendedores.length}
                              </div>
                            </div>
                            <div className="mt-[0.75rem]">
                              <h2 className="text-[15px] font-bold leading-[22px] text-white">
                                {v.nombre} {v.apellido?.charAt(0)}.
                              </h2>
                              <p className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">
                                {v.sucursal || v.plaza} · {v.plaza}
                              </p>
                            </div>
                            <div className="my-[0.75rem] h-px w-full bg-surface-container-highest"></div>
                            <div className="grid grid-cols-2 gap-y-[0.5rem] gap-x-[0.75rem]">
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-white">{v.vta_ov}%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">VTA/OV</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-white">{v.prod}</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">PROD</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-white">{v.no_comp}%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">NO COMP</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-white">{v.lanzamientos}%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">LANZ</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-white">1%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">NO ENTR</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-white">{v.cobranza}%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">COBR</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-white">{v.relevamiento}%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">RELEV</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-primary">#{v.posicion_sucursal}</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">EN SUC</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    } else if (position === 2) {
                      return (
                        <div
                          key={v.id}
                          className="relative rounded-2xl bg-surface-container-low p-[1.25rem] flex flex-col justify-between overflow-hidden shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                          style={{
                            boxShadow: "0 0 20px -2px rgba(255, 202, 69, 0.28), inset 0 0 16px -4px rgba(255, 202, 69, 0.15)",
                            outline: "1.5px solid #ffca45",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-transparent to-transparent pointer-events-none"></div>
                          <div className="relative z-10 flex flex-col">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col">
                                <span className="text-[38px] font-bold leading-[42px] tracking-[-0.02em] text-white">
                                  {v.puntaje}
                                </span>
                                <span className="font-jetbrains text-[9px] font-semibold leading-[12px] tracking-[0.08em] text-on-surface-variant uppercase mt-1">
                                  PUNTAJE
                                </span>
                              </div>
                              <div className="font-jetbrains text-[12px] font-normal leading-[16px] text-outline tracking-wider">
                                #{String(v.posicion_general || position).padStart(2, "0")}{" "}
                                <span className="text-surface-variant">/</span> {vendedores.length}
                              </div>
                            </div>
                            <div className="mt-[0.75rem]">
                              <h2 className="text-[15px] font-bold leading-[22px] text-white">
                                {v.nombre} {v.apellido?.charAt(0)}.
                              </h2>
                              <p className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">
                                {v.sucursal || v.plaza} · {v.plaza}
                              </p>
                            </div>
                            <div className="my-[0.75rem] h-px w-full bg-surface-container-highest"></div>
                            <div className="grid grid-cols-2 gap-y-[0.5rem] gap-x-[0.75rem]">
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-white">{v.vta_ov}%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">VTA/OV</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-white">{v.prod}</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">PROD</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-white">{v.no_comp}%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">NO COMP</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-error">{v.lanzamientos}%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">LANZ</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-white">2%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">NO ENTR</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-white">{v.cobranza}%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">COBR</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-white">{v.relevamiento}%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">RELEV</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-secondary">#{v.posicion_sucursal}</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">EN SUC</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={v.id}
                          className="relative rounded-2xl bg-surface-container-low p-[1.25rem] flex flex-col justify-between overflow-hidden shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                          style={{
                            boxShadow: "0 0 20px -2px rgba(255, 180, 171, 0.28), inset 0 0 16px -4px rgba(255, 180, 171, 0.15)",
                            outline: "1.5px solid #ffb4ae",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-error-container/20 via-transparent to-transparent pointer-events-none"></div>
                          <div className="relative z-10 flex flex-col">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col">
                                <span className="text-[38px] font-bold leading-[42px] tracking-[-0.02em] text-white">
                                  {v.puntaje}
                                </span>
                                <span className="font-jetbrains text-[9px] font-semibold leading-[12px] tracking-[0.08em] text-on-surface-variant uppercase mt-1">
                                  PUNTAJE
                                </span>
                              </div>
                              <div className="font-jetbrains text-[12px] font-normal leading-[16px] text-outline tracking-wider">
                                #{String(v.posicion_general || position).padStart(2, "0")}{" "}
                                <span className="text-surface-variant">/</span> {vendedores.length}
                              </div>
                            </div>
                            <div className="mt-[0.75rem]">
                              <h2 className="text-[15px] font-bold leading-[22px] text-white">
                                {v.nombre} {v.apellido?.charAt(0)}.
                              </h2>
                              <p className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">
                                {v.sucursal || v.plaza} · {v.plaza}
                              </p>
                            </div>
                            <div className="my-[0.75rem] h-px w-full bg-surface-container-highest"></div>
                            <div className="grid grid-cols-2 gap-y-[0.5rem] gap-x-[0.75rem]">
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-white">{v.vta_ov}%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">VTA/OV</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-white">{v.prod}</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">PROD</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-error">{v.no_comp}%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">NO COMP</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-error">{v.lanzamientos}%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">LANZ</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-white">3%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">NO ENTR</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-error">{v.cobranza}%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">COBR</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-white">{v.relevamiento}%</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">RELEV</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="font-jetbrains text-[13px] font-bold leading-[16px] text-error">#{v.posicion_sucursal}</span>
                                <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">EN SUC</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </section>

              {/* Filters */}
              <div className="bg-surface-container-low rounded-xl p-[1.25rem] flex flex-col gap-[0.75rem] shadow-md">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-[0.75rem]">
                  <div className="relative flex-1 min-w-[320px]">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                      search
                    </span>
                    <input
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface text-on-surface placeholder:text-outline text-[13px] font-normal leading-[18px] focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                      placeholder="Buscar por vendedor, sucursal, ID o zona geográfica..."
                      type="text"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-[0.5rem]">
                    <div className="flex items-center gap-[0.25rem] px-[0.75rem] py-2 rounded-lg bg-surface text-on-surface shadow-sm cursor-pointer hover:bg-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-outline text-[18px]">calendar_today</span>
                      <span className="text-[13px] font-normal leading-[18px]">Octubre 2024 (Mes Actual)</span>
                      <span className="material-symbols-outlined text-outline text-[16px]">expand_more</span>
                    </div>
                    <div className="flex items-center gap-[0.25rem] px-[0.75rem] py-2 rounded-lg bg-surface text-on-surface shadow-sm cursor-pointer hover:bg-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-outline text-[18px]">sort</span>
                      <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-on-surface-variant uppercase">
                        Orden:
                      </span>
                      <span className="text-[13px] font-medium leading-[18px]">Puntaje General (Desc)</span>
                      <span className="material-symbols-outlined text-outline text-[16px]">expand_more</span>
                    </div>
                    <div className="flex items-center gap-[0.25rem] px-[0.75rem] py-2 rounded-lg bg-surface text-on-surface shadow-sm cursor-pointer hover:bg-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-outline text-[18px]">tune</span>
                      <span className="text-[13px] font-normal leading-[18px]">Todos los Niveles</span>
                      <span className="material-symbols-outlined text-outline text-[16px]">expand_more</span>
                    </div>
                    <button className="px-[0.75rem] py-2 rounded-lg bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors text-[13px] font-normal leading-[18px] flex items-center gap-[0.25rem]">
                      <span className="material-symbols-outlined text-[16px]">refresh</span>
                      <span>Limpiar</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-[0.5rem] pt-[0.25rem]">
                  <div className="flex flex-wrap items-center gap-[0.25rem]">
                    <span className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] text-on-surface-variant uppercase mr-2">
                      Plaza / Sucursal:
                    </span>
                    <button className="px-3 py-1 rounded-full font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] uppercase bg-primary text-on-primary">
                      Todas ({vendedores.length})
                    </button>
                    <button className="px-3 py-1 rounded-full font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] uppercase bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
                      Rosario
                    </button>
                    <button className="px-3 py-1 rounded-full font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] uppercase bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
                      Córdoba
                    </button>
                    <button className="px-3 py-1 rounded-full font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] uppercase bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
                      Salta
                    </button>
                    <button className="px-3 py-1 rounded-full font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] uppercase bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
                      CABA
                    </button>
                  </div>
                  <div className="flex items-center gap-[0.75rem]">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex w-2.5 h-2.5 rounded-full bg-primary"></span>
                      <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-on-surface-variant">
                        Top (&gt;85)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex w-2.5 h-2.5 rounded-full bg-secondary"></span>
                      <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-on-surface-variant">
                        Medio (70-84)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex w-2.5 h-2.5 rounded-full bg-error"></span>
                      <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-on-surface-variant">
                        Riesgo (&lt;70)
                      </span>
                    </div>
                    <span className="font-jetbrains text-[12px] font-normal leading-[16px] text-outline pl-[0.5rem]">
                      Mostrando 10 de {vendedores.length} registros
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-surface-container-low rounded-2xl overflow-hidden shadow-xl flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="h-10 bg-surface-container text-on-surface-variant font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] uppercase">
                        <th className="px-[0.75rem] py-[0.25rem] font-semibold text-center w-14"># Pos</th>
                        <th className="px-[0.75rem] py-[0.25rem] font-semibold text-center w-16">Tend.</th>
                        <th className="px-[0.75rem] py-[0.25rem] font-semibold">Vendedor / Plaza</th>
                        <th className="px-[0.75rem] py-[0.25rem] font-semibold">Zona</th>
                        <th className="px-[0.75rem] py-[0.25rem] font-semibold text-right">Puntaje</th>
                        <th className="px-[0.75rem] py-[0.25rem] font-semibold text-right">VTA / OV</th>
                        <th className="px-[0.75rem] py-[0.25rem] font-semibold text-right">Prod</th>
                        <th className="px-[0.75rem] py-[0.25rem] font-semibold text-right">No Comp</th>
                        <th className="px-[0.75rem] py-[0.25rem] font-semibold text-right">Lanzamientos</th>
                        <th className="px-[0.75rem] py-[0.25rem] font-semibold text-right">Cobranza</th>
                        <th className="px-[0.75rem] py-[0.25rem] font-semibold text-right">Relevamiento</th>
                        <th className="px-[0.75rem] py-[0.25rem] font-semibold text-center">En Suc.</th>
                        <th className="px-[0.75rem] py-[0.25rem] font-semibold text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-0 text-on-surface text-[13px] font-normal leading-[18px]">
                      {tableData.map((v, idx) => {
                        const rowBg = idx % 2 === 0 ? "bg-surface-container-low" : "bg-surface-container/20";
                        const initials = v.iniciales || `${v.nombre?.charAt(0) || ""}${v.apellido?.charAt(0) || ""}`;
                        const isTop = v.puntaje >= 85;
                        const isMid = v.puntaje >= 70 && v.puntaje < 85;
                        const isRisk = v.puntaje < 70;
                        const posBadgeClass = isTop
                          ? "bg-primary/20 text-primary"
                          : isMid
                          ? "bg-secondary/15 text-secondary"
                          : "bg-error-container/30 text-error";
                        const scoreBadge = getScoreBadgeClass(v.puntaje);

                        return (
                          <tr key={v.id} className={`h-12 ${rowBg} hover:bg-surface-variant/40 transition-colors`}>
                            <td className="px-[0.75rem] text-center">
                              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-jetbrains text-[13px] font-bold leading-[16px] ${posBadgeClass}`}>
                                {String(v.posicion_general || idx + 1).padStart(2, "0")}
                              </span>
                            </td>
                            <td className="px-[0.75rem] text-center">{getTrendIcon(v.tendencia)}</td>
                            <td className="px-[0.75rem]">
                              <div className="flex items-center gap-[0.5rem]">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-jetbrains text-[13px] font-bold leading-[16px] ${posBadgeClass}`}>
                                  {initials}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[15px] font-bold leading-[22px] text-white">
                                    {v.nombre} {v.apellido}
                                  </span>
                                  <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-outline uppercase">
                                    {v.sucursal || v.plaza} · {v.plaza}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-[0.75rem]">
                              <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] uppercase px-2 py-0.5 rounded bg-surface text-on-surface-variant">
                                {v.zona || "N/A"}
                              </span>
                            </td>
                            <td className="px-[0.75rem] text-right">
                              <span className={`inline-block px-2.5 py-1 rounded-md font-jetbrains text-[13px] font-bold leading-[16px] ${scoreBadge}`}>
                                {v.puntaje} PTS
                              </span>
                            </td>
                            <td className="px-[0.75rem] text-right font-jetbrains text-[13px] font-bold leading-[16px] text-white">
                              {v.vta_ov}%
                            </td>
                            <td className="px-[0.75rem] text-right font-jetbrains text-[13px] font-bold leading-[16px] text-white">
                              {v.prod}
                            </td>
                            <td className="px-[0.75rem] text-right font-jetbrains text-[13px] font-normal leading-[16px] text-on-surface-variant">
                              {v.no_comp}%
                            </td>
                            <td className="px-[0.75rem] text-right font-jetbrains text-[13px] font-bold leading-[16px] text-white">
                              {v.lanzamientos}%
                            </td>
                            <td className="px-[0.75rem] text-right font-jetbrains text-[13px] font-bold leading-[16px] text-white">
                              {v.cobranza}%
                            </td>
                            <td className="px-[0.75rem] text-right font-jetbrains text-[13px] font-bold leading-[16px] text-white">
                              {v.relevamiento}%
                            </td>
                            <td className="px-[0.75rem] text-center font-jetbrains text-[13px] font-bold leading-[16px] text-white">
                              #{v.posicion_sucursal}
                            </td>
                            <td className="px-[0.75rem] text-center">
                              <button className="px-[0.75rem] py-1 rounded bg-surface hover:bg-surface-variant text-on-surface font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] uppercase transition-colors">
                                Ficha
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="px-[1.25rem] py-[0.75rem] bg-surface-container flex flex-col md:flex-row items-center justify-between gap-[0.75rem]">
                  <div className="flex items-center gap-[1.25rem]">
                    <span className="text-[13px] font-normal leading-[18px] text-on-surface-variant">
                      Mostrando <span className="text-white font-jetbrains text-[13px] font-bold leading-[16px]">1-10</span> de{" "}
                      <span className="text-white font-jetbrains text-[13px] font-bold leading-[16px]">{vendedores.length}</span> vendedores clasificados
                    </span>
                    <div className="flex items-center gap-[0.25rem] text-on-surface-variant">
                      <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] uppercase">Filas por página:</span>
                      <div className="px-2 py-0.5 rounded bg-surface text-white font-jetbrains text-[13px] font-bold leading-[16px] flex items-center gap-1 cursor-pointer">
                        <span>10</span>
                        <span className="material-symbols-outlined text-[14px]">expand_more</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="w-8 h-8 rounded flex items-center justify-center text-outline hover:text-white hover:bg-surface-variant transition-colors disabled:opacity-40" disabled>
                      <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>
                    <button className="w-8 h-8 rounded bg-primary text-on-primary font-jetbrains text-[13px] font-bold leading-[16px] flex items-center justify-center shadow-sm">
                      1
                    </button>
                    <button className="w-8 h-8 rounded bg-surface text-on-surface-variant hover:text-white hover:bg-surface-variant font-jetbrains text-[12px] font-normal leading-[16px] flex items-center justify-center transition-colors">
                      2
                    </button>
                    <button className="w-8 h-8 rounded bg-surface text-on-surface-variant hover:text-white hover:bg-surface-variant font-jetbrains text-[12px] font-normal leading-[16px] flex items-center justify-center transition-colors">
                      3
                    </button>
                    <span className="px-2 text-outline font-jetbrains text-[9px] font-normal leading-[12px]">...</span>
                    <button className="w-8 h-8 rounded bg-surface text-on-surface-variant hover:text-white hover:bg-surface-variant font-jetbrains text-[12px] font-normal leading-[16px] flex items-center justify-center transition-colors">
                      14
                    </button>
                    <button className="w-8 h-8 rounded flex items-center justify-center text-on-surface hover:text-white hover:bg-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
