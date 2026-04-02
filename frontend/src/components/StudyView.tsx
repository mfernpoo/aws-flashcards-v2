import React, { useId, useState } from 'react';
import { Flashcard } from './Flashcard';
import { Flashcard as IFlashcard, FlashcardFilters, Grade } from '../types';
import { Search, Filter, RefreshCw, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StudyViewProps {
  currentCard: IFlashcard | null;
  dueCount: number;
  totalCards: number;
  learnedCards: number;
  totalStreak: number;
  filters: FlashcardFilters;
  domains: string[];
  canSkip: boolean;
  onDomainChange: (domain: string) => void;
  onTagChange: (tag: string) => void;
  onClearFilters: () => void;
  onSkipCard: () => void;
  onGrade: (grade: Grade) => void | Promise<void>;
}

export const StudyView: React.FC<StudyViewProps> = ({
  currentCard,
  dueCount,
  totalCards,
  learnedCards,
  totalStreak,
  filters,
  domains,
  canSkip,
  onDomainChange,
  onTagChange,
  onClearFilters,
  onSkipCard,
  onGrade,
}) => {
  const domainFilterId = useId();
  const tagFilterId = useId();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const hasActiveFilters = Boolean(filters.domain || filters.tag);

  return (
    <section className="space-y-7 animate-in fade-in duration-500" aria-labelledby="study-view-title">
      <header className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h2 id="study-view-title" className="text-3xl font-bold text-aws-dark">Modo Estudio</h2>
          <p className="text-gray-600">
            Tienes <span className="text-aws-orange font-bold">{dueCount}</span> cartas por revisar hoy
          </p>
        </div>

        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4" aria-label="Filtros de estudio">

          {/* ── MOBILE: fila compacta ── */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setIsFiltersOpen((o) => !o)}
              aria-expanded={isFiltersOpen}
              className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aws-orange focus-visible:ring-offset-2"
            >
              <Filter size={15} aria-hidden="true" />
              Filtros
              {hasActiveFilters && (
                <span
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-aws-orange rounded-full border-2 border-white"
                  aria-label="Filtros activos"
                />
              )}
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-aws-orange border border-gray-200 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aws-orange focus-visible:ring-offset-2"
              >
                <RefreshCw size={14} aria-hidden="true" />
                Limpiar
              </button>
            )}

            <button
              type="button"
              onClick={onSkipCard}
              disabled={!canSkip}
              aria-label="Cambiar carta"
              title="Cambiar carta"
              className="ml-auto p-2 text-gray-500 hover:text-aws-orange border border-gray-200 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aws-orange focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Shuffle size={16} aria-hidden="true" />
            </button>
          </div>

          {/* ── MOBILE: panel colapsable ── */}
          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden lg:hidden"
              >
                <div className="flex flex-col gap-3 pt-3">
                  <div>
                    <label htmlFor={`${domainFilterId}-mobile`} className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Dominio
                    </label>
                    <div className="relative">
                      <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                      <select
                        id={`${domainFilterId}-mobile`}
                        value={filters.domain}
                        onChange={(e) => onDomainChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-aws-orange transition-all appearance-none"
                      >
                        <option value="">Todos los dominios</option>
                        {domains.map((domain) => (
                          <option key={domain} value={domain}>{domain}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`${tagFilterId}-mobile`} className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Tag
                    </label>
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                      <input
                        id={`${tagFilterId}-mobile`}
                        type="text"
                        placeholder="Ej: iam"
                        value={filters.tag}
                        onChange={(e) => onTagChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-aws-orange transition-all"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {hasActiveFilters
                      ? `Activos: ${filters.domain || 'todos los dominios'}${filters.tag ? `, #${filters.tag}` : ''}`
                      : 'Sin filtros activos.'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── DESKTOP: panel completo ── */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
              <Filter size={16} aria-hidden="true" className="text-gray-500" />
              Filtrar sesión
            </div>
            <div className="flex lg:items-end gap-3">
              <div className="flex-1">
                <label htmlFor={domainFilterId} className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Dominio
                </label>
                <div className="relative">
                  <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <select
                    id={domainFilterId}
                    value={filters.domain}
                    onChange={(e) => onDomainChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-aws-orange transition-all appearance-none"
                  >
                    <option value="">Todos los dominios</option>
                    {domains.map((domain) => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor={tagFilterId} className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Tag
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <input
                    id={tagFilterId}
                    type="text"
                    placeholder="Ej: iam"
                    value={filters.tag}
                    onChange={(e) => onTagChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-aws-orange transition-all"
                  />
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-gray-600 hover:text-aws-orange border border-gray-200 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aws-orange focus-visible:ring-offset-2"
                  title="Limpiar filtros"
                >
                  <RefreshCw size={18} aria-hidden="true" />
                  Limpiar
                </button>
              )}
              <button
                type="button"
                onClick={onSkipCard}
                disabled={!canSkip}
                aria-label="Cambiar carta"
                title="Cambiar carta"
                className="p-2.5 text-gray-500 hover:text-aws-orange border border-gray-200 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aws-orange focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Shuffle size={18} aria-hidden="true" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {hasActiveFilters
                ? `Filtros activos: ${filters.domain || 'todos los dominios'}${filters.tag ? `, tag ${filters.tag}` : ''}.`
                : 'No hay filtros activos en la sesión de estudio.'}
            </p>
          </div>

        </section>
      </header>

      <div className="py-6">
        <AnimatePresence mode="wait">
          {currentCard ? (
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Flashcard card={currentCard} onGrade={onGrade} />
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 md:p-16 text-center space-y-4"
            >
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw size={40} aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">¡Todo al día!</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No tienes más cartas pendientes para estudiar con los filtros seleccionados.
                Vuelve mañana o cambia los filtros.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <p className="text-sm text-gray-600">
                  {hasActiveFilters ? 'Prueba quitando los filtros para ver más cartas.' : 'Tu próxima sesión estará disponible cuando haya cartas vencidas.'}
                </p>
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="px-6 py-3 bg-aws-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aws-orange focus-visible:ring-offset-2"
                >
                  Ver todas las cartas
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-11 h-11 bg-aws-orange/10 text-aws-orange rounded-lg flex items-center justify-center font-bold text-lg">
            {totalCards}
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Mazo</p>
            <p className="text-lg font-bold text-aws-dark">Cartas</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center font-bold text-lg">
            {learnedCards}
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Aprendidas</p>
            <p className="text-lg font-bold text-aws-dark">Dominadas</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-11 h-11 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center font-bold text-lg">
            {totalStreak}
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Esfuerzo</p>
            <p className="text-lg font-bold text-aws-dark">Racha Total</p>
          </div>
        </div>
      </div>
    </section>
  );
};
