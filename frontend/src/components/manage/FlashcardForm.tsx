import React, { useState, useEffect, useId } from 'react';
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
  className?: string;
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
  className,
}) => {
  const [localTags, setLocalTags] = useState(card.tags?.join(', ') || '');
  const frontId = useId();
  const backId = useId();
  const domainId = useId();
  const tagsId = useId();
  const frontValue = card.front?.trim() || '';
  const backValue = card.back?.trim() || '';
  const isSaveDisabled = !frontValue || !backValue;

  useEffect(() => {
    const currentTags = card.tags || [];
    // Normalizamos el input local para compararlo con la fuente de verdad
    const localTagsNormalized = localTags
      .split(',')
      .map((tag) => tag.trim())
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
    <section
      className={`bg-white rounded-xl border-2 border-aws-orange shadow-xl p-6 space-y-6 ${className ?? ''}`}
      aria-label="Editor de flashcards"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-aws-dark">
          {card.id ? 'Editar Carta' : 'Nueva Carta'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aws-orange focus-visible:ring-offset-2 rounded"
          aria-label="Cerrar editor de flashcard"
        >
          <X size={20} />
        </button>
      </div>

      <form className="space-y-4" onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}>
        <div>
          <label htmlFor={frontId} className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Frente (Pregunta)
          </label>
          <textarea
            id={frontId}
            value={card.front || ''}
            onChange={(event) => onFrontChange(event.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-aws-orange h-24 resize-y"
            placeholder="Ej: ¿Qué es Amazon EC2?"
          />
          <p className="mt-2 text-xs text-gray-500">
            Usa una sola idea por tarjeta para mantener la sesión de estudio ágil.
          </p>
        </div>
        <div>
          <label htmlFor={backId} className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Reverso (Respuesta)
          </label>
          <textarea
            id={backId}
            value={card.back || ''}
            onChange={(event) => onBackChange(event.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-aws-orange h-32 resize-y"
            placeholder="Ej: Servicio de cómputo escalable..."
          />
          <p className="mt-2 text-xs text-gray-500">
            Puedes extender la respuesta; el campo permite redimensionar en vertical.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={domainId} className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Dominio
            </label>
            <select
              id={domainId}
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
            <label htmlFor={tagsId} className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Tags
            </label>
            <input
              id={tagsId}
              type="text"
              placeholder="s3, iam, ec2..."
              value={localTags}
              onChange={handleTagsChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-aws-orange"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSaveDisabled}
            className="flex-grow flex items-center justify-center gap-2 py-3 bg-aws-orange text-white rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-aws-orange transition-all shadow-lg shadow-orange-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aws-orange focus-visible:ring-offset-2"
          >
            <Save size={18} aria-hidden="true" /> Guardar Cambios
          </button>
          {card.id && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(card.id!)}
              className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
              aria-label={`Eliminar tarjeta: ${card.front || 'sin titulo'}`}
              title="Eliminar tarjeta"
            >
              <Trash2 size={20} aria-hidden="true" />
            </button>
          )}
        </div>
        {isSaveDisabled && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Completa frente y reverso antes de guardar la tarjeta.
          </p>
        )}
      </form>
    </section>
  );
};
