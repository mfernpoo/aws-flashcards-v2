import React, { useMemo } from 'react';
import { Flashcard } from './Flashcard';
import { Flashcard as IFlashcard, Grade } from '../types';
import { Search, Filter, RefreshCw } from 'lucide-react';

interface StudyViewProps {
  dueCards: IFlashcard[];
  allCards: IFlashcard[];
  filters: { domain: string, tag: string };
  onFilterChange: (filters: { domain: string, tag: string }) => void;
  onGrade: (card: IFlashcard, grade: Grade) => void;
}

export const StudyView: React.FC<StudyViewProps> = ({ 
  dueCards, 
  allCards, 
  filters, 
  onFilterChange,
  onGrade 
}) => {
  const domains = useMemo(() => Array.from(new Set(allCards.map(c => c.domain).filter(Boolean))), [allCards]);
  
  const currentCard = useMemo(() => {
    if (dueCards.length === 0) return null;
    // Simple Leitner: pick card with lowest box first
    const lowestBox = Math.min(...dueCards.map(c => c.srs.box));
    const pool = dueCards.filter(c => c.srs.box === lowestBox);
    return pool[Math.floor(Math.random() * pool.length)];
  }, [dueCards]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-aws-dark">Modo Estudio</h2>
          <p className="text-gray-500 mt-1">
            Tienes <span className="text-aws-orange font-bold">{dueCards.length}</span> cartas por revisar hoy
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select 
              value={filters.domain}
              onChange={(e) => onFilterChange({ ...filters, domain: e.target.value })}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-aws-orange transition-all appearance-none"
            >
              <option value="">Todos los dominios</option>
              {domains.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Filtrar por tag..."
              value={filters.tag}
              onChange={(e) => onFilterChange({ ...filters, tag: e.target.value })}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-aws-orange transition-all"
            />
          </div>
          <button 
            onClick={() => onFilterChange({ domain: '', tag: '' })}
            className="p-2 text-gray-400 hover:text-aws-orange transition-colors"
            title="Limpiar filtros"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      <div className="py-10">
        {currentCard ? (
          <Flashcard 
            card={currentCard} 
            onGrade={(grade) => onGrade(currentCard, grade)} 
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 text-center space-y-4">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCw size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">¡Todo al día!</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              No tienes más cartas pendientes para estudiar con los filtros seleccionados. 
              Vuelve mañana o cambia los filtros.
            </p>
            <button 
              onClick={() => onFilterChange({ domain: '', tag: '' })}
              className="mt-6 px-6 py-3 bg-aws-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
            >
              Ver todas las cartas
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-aws-orange/10 text-aws-orange rounded-lg flex items-center justify-center font-bold text-xl">
            {allCards.length}
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Mazo</p>
            <p className="text-lg font-bold text-aws-dark">Cartas</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center font-bold text-xl">
            {allCards.filter(c => c.srs.box >= 4).length}
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Aprendidas</p>
            <p className="text-lg font-bold text-aws-dark">Dominadas</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center font-bold text-xl">
            {allCards.reduce((acc, c) => acc + (c.srs.streak || 0), 0)}
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Esfuerzo</p>
            <p className="text-lg font-bold text-aws-dark">Racha Total</p>
          </div>
        </div>
      </div>
    </div>
  );
};
