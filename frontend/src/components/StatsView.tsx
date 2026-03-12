import React from 'react';
import { BoxStat, DomainProgress } from '../utils/stats';

interface StatsViewProps {
  boxStats: BoxStat[];
  progressByDomain: DomainProgress[];
}

export const StatsView: React.FC<StatsViewProps> = ({ boxStats, progressByDomain }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-aws-dark mb-8">Estadísticas de Aprendizaje</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {boxStats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.accentClass}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold mb-6">Progreso por Dominio</h3>
        <div className="space-y-6">
          {progressByDomain.map((domain) => (
            <div key={domain.domain}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-gray-700">{domain.domain}</span>
                <span className="text-gray-400">
                  {domain.percent}% ({domain.learned}/{domain.total})
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-aws-orange h-full transition-all duration-1000"
                  style={{ width: `${domain.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
