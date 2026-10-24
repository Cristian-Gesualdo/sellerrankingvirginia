import { getRankingPorPeriodo } from "@/lib/vendedores-csv";
import { RankingExplorer } from "@/components/ranking-explorer";

export default async function Home() {
  const periodos = await getRankingPorPeriodo();
  const { vendedores, periodoLabel } = periodos[0] ?? { vendedores: [], periodoLabel: "" };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-primary z-50 flex flex-col justify-between py-[1.25rem]">
        <div className="flex flex-col gap-[1.75rem]">
          <div className="px-[1.25rem] flex items-center gap-[0.5rem]">
            <div className="w-8 h-8 rounded-lg bg-on-primary/15 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">query_stats</span>
            </div>
            <div className="flex flex-col">
              <span className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] text-on-primary uppercase">
                La Virginia
              </span>
              <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-on-primary/70 uppercase">
                Gestión Comercial
              </span>
            </div>
          </div>
          <nav className="flex flex-col gap-[0.25rem] px-[0.75rem]">
            <div className="px-[0.75rem] py-[0.25rem]">
              <span className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] text-on-primary/70 uppercase">
                Análisis Comercial
              </span>
            </div>
            <a
              aria-current="page"
              className="flex items-center gap-[0.75rem] px-[0.75rem] py-[0.5rem] rounded-lg transition-colors bg-secondary text-on-secondary font-semibold"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">leaderboard</span>
              <span className="text-[13px] font-medium leading-[18px]">Ranking General</span>
            </a>
            <a
              className="flex items-center gap-[0.75rem] px-[0.75rem] py-[0.5rem] rounded-lg text-on-primary/70 hover:bg-on-primary/10 hover:text-on-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">target</span>
              <span className="text-[13px] font-normal leading-[18px]">Cuotas y Objetivos</span>
            </a>
            <a
              className="flex items-center gap-[0.75rem] px-[0.75rem] py-[0.5rem] rounded-lg text-on-primary/70 hover:bg-on-primary/10 hover:text-on-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">public</span>
              <span className="text-[13px] font-normal leading-[18px]">Rendimiento Regional</span>
            </a>
            <a
              className="flex items-center gap-[0.75rem] px-[0.75rem] py-[0.5rem] rounded-lg text-on-primary/70 hover:bg-on-primary/10 hover:text-on-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">monitoring</span>
              <span className="text-[13px] font-normal leading-[18px]">Telemetría Vendedores</span>
            </a>
            <div className="mt-[0.75rem] px-[0.75rem] py-[0.25rem]">
              <span className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] text-on-primary/70 uppercase">
                Estrategia
              </span>
            </div>
            <a
              className="flex items-center gap-[0.75rem] px-[0.75rem] py-[0.5rem] rounded-lg text-on-primary/70 hover:bg-on-primary/10 hover:text-on-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span className="text-[13px] font-normal leading-[18px]">Pipeline & Riesgos</span>
            </a>
            <a
              className="flex items-center gap-[0.75rem] px-[0.75rem] py-[0.5rem] rounded-lg text-on-primary/70 hover:bg-on-primary/10 hover:text-on-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">payments</span>
              <span className="text-[13px] font-normal leading-[18px]">Comisiones</span>
            </a>
          </nav>
        </div>
        <div className="px-[0.75rem]">
          <div className="p-[0.75rem] rounded-lg bg-on-primary/10 flex flex-col gap-[0.25rem]">
            <div className="flex items-center justify-between">
              <span className="font-jetbrains text-[10px] font-semibold leading-[14px] tracking-[0.12em] text-on-primary/70 uppercase">
                Sync Engine
              </span>
              <span className="w-2 h-2 rounded-full bg-success"></span>
            </div>
            <span className="font-jetbrains text-[9px] font-normal leading-[12px] tracking-[0.08em] text-on-primary">
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
                  {periodoLabel} · {vendedores.length} Vendedores
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
              <button className="flex items-center gap-[0.25rem] px-[0.75rem] py-[0.25rem] rounded-lg bg-secondary text-on-secondary font-semibold transition-opacity hover:opacity-90">
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
            <RankingExplorer periodos={periodos} />
        </main>
      </div>
    </div>
  );
}
