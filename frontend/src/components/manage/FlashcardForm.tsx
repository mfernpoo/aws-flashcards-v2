import React, { useState, useEffect } from 'react';
import { Save, Trash2, X } from 'lucide-react';
import { Flashcard } from '../../types';
import { DECK_DOMAINS } from '../../constants/domains';

interface FlashcardFormProps {
  card: Partial<Flashcard>;
  onClose: () => void;
  onFrontChange: (value: string) => void;
  onBackChange: (value: string) => void;
  onDomainChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onSave: () => void;
  onDelete?: (id: string) => void;
}

export const FlashcardForm: React.FC<FlashcardFormProps> = ({
  card,
  onClose,
  onFrontChange,
  onBackChange,
  onDomainChange,
  onTagsChange,
  onSave,
  onDelete,
}) => {
  const [localTags, setLocalTags] = useState(card.tags?.join(', ') || '');

  useEffect(() => {
    const currentTags = card.tags || [];
    // Normalizamos el input local para compararlo con la fuente de verdad
    const localTagsNormalized = localTags
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    // Comparamos el contenido semántico. Si es diferente, significa que
    // el cambio vino de fuera (ej: cargar otra carta) y debemos actualizar el local.
    // Usamos JSON.stringify para una comparación simple de arrays de strings.
    if (JSON.stringify(currentTags) !== JSON.stringify(localTagsNormalized)) {
      setLocalTags(card.tags?.join(', ') || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.tags, card.id]);

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalTags(value);
    onTagsChange(value);
  };

  return (
    <div className="bg-white rounded-xl border-2 border-aws-orange shadow-xl p-6 sticky top-8 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-aws-dark">
          {card.id ? 'Editar Carta' : 'Nueva Carta'}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Frente (Pregunta)
          </label>
          <textarea
            value={card.front || ''}
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
            value={card.back || ''}
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
              value={card.domain || ''}
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
              value={localTags}
              onChange={handleTagsChange}
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
        {card.id && onDelete && (
          <button
            onClick={() => onDelete(card.id!)}
            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
};
