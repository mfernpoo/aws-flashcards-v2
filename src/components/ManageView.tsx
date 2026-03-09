import React from 'react';
import { Flashcard as IFlashcard } from '../types';
import { Search, Plus, Save, Trash2, Edit3, X } from 'lucide-react';
import { DECK_DOMAINS } from '../constants/domains';

interface ManageViewProps {
  cards: IFlashcard[];
  search: string;
  editingCard: Partial<IFlashcard> | null;
  onSearchChange: (search: string) => void;
  onCreateCard: () => void;
  onEditCard: (card: IFlashcard) => void;
  onCloseEditor: () => void;
  onFrontChange: (front: string) => void;
  onBackChange: (back: string) => void;
  onDomainChange: (domain: string) => void;
  onTagsChange: (tags: string) => void;
  onSave: () => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ManageView: React.FC<ManageViewProps> = ({
  cards,
  search,
  editingCard,
  onSearchChange,
  onCreateCard,
  onEditCard,
  onCloseEditor,
  onFrontChange,
  onBackChange,
  onDomainChange,
  onTagsChange,
  onSave,
  onDelete,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-aws-dark">Gestionar Mazo</h2>
          <p className="text-gray-500 mt-1">Crea, edita o elimina flashcards</p>
        </div>
        <button
          onClick={onCreateCard}
          className="flex items-center gap-2 px-5 py-2.5 bg-aws-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
        >
          <Plus size={20} /> Nueva Carta
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en el mazo..."
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-aws-orange transition-all shadow-sm"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              {cards.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider sticky top-0">
                    <tr>
                      <th className="px-6 py-4">Frente / Contenido</th>
                      <th className="px-6 py-4">Dominio</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cards.map((card) => (
                      <tr key={card.id} className="hover:bg-aws-light/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800 line-clamp-1">{card.front}</div>
                          <div className="text-xs text-gray-400 mt-1 flex gap-1">
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
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onEditCard(card)}
                              className="p-1.5 text-gray-400 hover:text-aws-blue transition-colors"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => onDelete(card.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-20 text-center text-gray-400">No se encontraron cartas</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {editingCard ? (
            <div className="bg-white rounded-xl border-2 border-aws-orange shadow-xl p-6 sticky top-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-aws-dark">
                  {editingCard.id ? 'Editar Carta' : 'Nueva Carta'}
                </h3>
                <button onClick={onCloseEditor} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Frente (Pregunta)
                  </label>
                  <textarea
                    value={editingCard.front || ''}
                    onChange={(event) => onFrontChange(event.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-aws-orange h-24 resize-none"
                    placeholder="Ej: ¿Qué es Amazon EC2?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Reverso (Respuesta)
                  </label>
                  <textarea
                    value={editingCard.back || ''}
                    onChange={(event) => onBackChange(event.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-aws-orange h-32 resize-none"
                    placeholder="Ej: Servicio de cómputo escalable..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Dominio
                    </label>
                    <select
                      value={editingCard.domain || ''}
                      onChange={(event) => onDomainChange(event.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-aws-orange"
                    >
                      <option value="">(Ninguno)</option>
                      {DECK_DOMAINS.map((domain) => (
                        <option key={domain.value} value={domain.value}>
                          {domain.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      placeholder="s3, iam, ec2..."
                      value={editingCard.tags?.join(', ') || ''}
                      onChange={(event) => onTagsChange(event.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-aws-orange"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={onSave}
                  className="flex-grow flex items-center justify-center gap-2 py-3 bg-aws-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                >
                  <Save size={18} /> Guardar Cambios
                </button>
                {editingCard.id && (
                  <button
                    onClick={() => onDelete(editingCard.id!)}
                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
              Selecciona una carta para editar o crea una nueva
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
