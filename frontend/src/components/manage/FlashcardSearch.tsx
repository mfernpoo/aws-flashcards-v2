import React, { useId } from 'react';
import { Search, X } from 'lucide-react';

interface FlashcardSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export const FlashcardSearch: React.FC<FlashcardSearchProps> = ({ value, onChange, resultCount }) => {
  const searchId = useId();

  return (
    <section className="bg-white border border-gray-100 rounded-xl shadow-sm p-4" aria-label="Busqueda de flashcards">
      <label htmlFor={searchId} className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
        Buscar en el mazo
      </label>
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input
          id={searchId}
          type="text"
          placeholder="Buscar por pregunta o respuesta"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-aws-orange transition-all shadow-sm"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aws-orange focus-visible:ring-offset-2 rounded"
            aria-label="Limpiar búsqueda"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
      <p className="mt-3 text-sm text-gray-600">
        {value ? `${resultCount} resultados para "${value}".` : `${resultCount} cartas disponibles en el listado.`}
      </p>
    </section>
  );
};
