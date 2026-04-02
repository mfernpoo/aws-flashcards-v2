import React, { useState, useEffect, useId } from 'react';
import { Save, Trash2, X } from 'lucide-react';
import { Flashcard } from '../../types';
import { DECK_DOMAINS } from '../../constants/domains';

interface FlashcardFormProps {
  card: Partial<Flashcard>;
  isSaving?: boolean;
  deletingId?: string | null;
  onClose: () => void;
  onFieldChange: (field: 'front' | 'back' | 'domain' | 'tags', value: string) => void;
  onSave: () => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const FlashcardForm: React.FC<FlashcardFormProps> = ({
  card,
  isSaving = false,
  deletingId = null,
  onClose,
  onFieldChange,
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
  const isSaveDisabled = !frontValue || !backValue || isSaving;
  const isDeletingThis = !!card.id && deletingId === card.id;

  useEffect(() => {
    const currentTags = card.tags || [];
    const localTagsNormalized = localTags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (JSON.stringify(currentTags) !== JSON.stringify(localTagsNormalized)) {
      setLocalTags(card.tags?.join(', ') || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.tags, card.id]);

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalTags(value);
    onFieldChange('tags', value);
  };

  return (
    <section
      className={`bg-white rounded-xl border-2 border-aws-orange shadow-xl p-6 space-y-6 ${className ?? ''}`}
      aria-label="Editor de flashcards"
      aria-busy={isSaving}
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
            onChange={(event) => onFieldChange('front', event.target.value)}
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
            onChange={(event) => onFieldChange('back', event.target.value)}
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
              onChange={(event) => onFieldChange('domain', event.target.value)}
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
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} aria-hidden="true" /> Guardar Cambios
              </>
            )}
          </button>
          {card.id && onDelete && (
            <button
              type="button"
              onClick={() => { if (card.id) onDelete(card.id); }}
              disabled={isDeletingThis || isSaving}
              className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Eliminar tarjeta: ${card.front || 'sin titulo'}`}
              aria-busy={isDeletingThis}
              title="Eliminar tarjeta"
            >
              {isDeletingThis ? (
                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 size={20} aria-hidden="true" />
              )}
            </button>
          )}
        </div>
        {isSaveDisabled && !isSaving && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Completa frente y reverso antes de guardar la tarjeta.
          </p>
        )}
      </form>
    </section>
  );
};
