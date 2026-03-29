import React from 'react';
import { BoxStat, DomainProgress } from '../utils/stats';

interface StatsViewProps {
  boxStats: BoxStat[];
  progressByDomain: DomainProgress[];
}

export const StatsView: React.FC<StatsViewProps> = ({ boxStats, progressByDomain }) => {
  return (
    <section className="animate-in fade-in duration-500" aria-labelledby="stats-view-title">
      <header className="mb-8">
        <h2 id="stats-view-title" className="text-3xl font-bold text-aws-dark">Estadísticas de Aprendizaje</h2>
        <p className="text-gray-600 mt-2">Resumen del avance del mazo y progreso por dominio.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" aria-label="Indicadores principales">
        {boxStats.map((stat) => (
          <article key={stat.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.accentClass}`}>{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-12 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" aria-labelledby="domain-progress-title">
        <h3 id="domain-progress-title" className="text-lg font-bold mb-2">Progreso por Dominio</h3>
        <p className="text-sm text-gray-600 mb-6">Porcentaje de cartas aprendidas dentro de cada dominio.</p>
        <div className="space-y-6">
          {progressByDomain.map((domain) => (
            <article key={domain.domain}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-gray-700">{domain.domain}</span>
                <span className="text-gray-600">
                  {domain.percent}% ({domain.learned}/{domain.total})
                </span>
              </div>
              <div
                className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"
                role="progressbar"
                aria-label={`Progreso del dominio ${domain.domain}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={domain.percent}
                aria-valuetext={`${domain.percent}% aprendido, ${domain.learned} de ${domain.total} cartas`}
              >
                <div
                  className="bg-aws-orange h-full transition-all duration-1000"
                  style={{ width: `${domain.percent}%` }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};
