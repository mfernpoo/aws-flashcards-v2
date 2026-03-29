import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { Flashcard } from '../../types';

interface FlashcardTableProps {
  cards: Flashcard[];
  onEdit: (card: Flashcard) => void;
  onDelete: (id: string) => void;
}

export const FlashcardTable: React.FC<FlashcardTableProps> = ({ cards, onEdit, onDelete }) => {
  return (
    <section
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full lg:min-h-0"
      aria-label="Listado de flashcards"
    >
      <div className="hidden lg:block lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
        {cards.length > 0 ? (
          <table className="w-full text-left">
            <caption className="sr-only">Lista de flashcards filtradas del mazo</caption>
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-4">
                  Frente / Contenido
                </th>
                <th scope="col" className="px-6 py-4">
                  Dominio
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {cards.map((card) => (
                <tr key={card.id} className="hover:bg-aws-light/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800 line-clamp-1">{card.front}</div>
                    <div className="text-xs text-gray-500 mt-1 flex gap-1 flex-wrap">
                      {card.tags.map((tag) => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">
                      {card.domain || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(card)}
                        className="p-1.5 text-gray-500 hover:text-aws-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aws-blue focus-visible:ring-offset-2 rounded"
                        aria-label={`Editar tarjeta: ${card.front}`}
                      >
                        <Edit3 size={18} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(card.id)}
                        className="p-1.5 text-gray-500 hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 rounded"
                        aria-label={`Eliminar tarjeta: ${card.front}`}
                      >
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-20 text-center text-gray-500">
            No se encontraron cartas para los criterios actuales.
          </div>
        )}
      </div>

      <div className="lg:hidden block p-4 space-y-4 bg-gray-50/50">
        {cards.length > 0 ? (
          cards.map((card) => (
            <article
              key={card.id}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-wider">
                  {card.domain || '-'}
                </span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(card)}
                    className="text-gray-500 hover:text-aws-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aws-blue focus-visible:ring-offset-2 rounded"
                    aria-label={`Editar tarjeta: ${card.front}`}
                  >
                    <Edit3 size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(card.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 rounded"
                    aria-label={`Eliminar tarjeta: ${card.front}`}
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="font-medium text-gray-800 text-sm leading-relaxed">{card.front}</div>

              {card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1 pt-3 border-t border-gray-50">
                  {card.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-xs text-gray-500 pt-1">
                Acciones disponibles: editar o eliminar.
              </div>
            </article>
          ))
        ) : (
          <div className="py-10 text-center text-gray-500 text-sm">
            No se encontraron cartas para los criterios actuales.
          </div>
        )}
      </div>
    </section>
  );
};
