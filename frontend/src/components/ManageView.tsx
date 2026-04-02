import React, { useId, useRef } from 'react';
import { Flashcard as IFlashcard } from '../types';
import { Plus } from 'lucide-react';
import { FlashcardSearch } from './manage/FlashcardSearch';
import { FlashcardTable } from './manage/FlashcardTable';
import { FlashcardForm } from './manage/FlashcardForm';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface ManageViewProps {
  cards: IFlashcard[];
  totalCards: number;
  search: string;
  editingCard: Partial<IFlashcard> | null;
  isSaving: boolean;
  deletingId: string | null;
  onSearchChange: (search: string) => void;
  onCreateCard: () => void;
  onEditCard: (card: IFlashcard) => void;
  onCloseEditor: () => void;
  onFieldChange: (field: 'front' | 'back' | 'domain' | 'tags', value: string) => void;
  onSave: () => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ManageView: React.FC<ManageViewProps> = ({
  cards,
  totalCards,
  search,
  editingCard,
  isSaving,
  deletingId,
  onSearchChange,
  onCreateCard,
  onEditCard,
  onCloseEditor,
  onFieldChange,
  onSave,
  onDelete,
}) => {
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const isEditing = !!editingCard;

  useEscapeKey(onCloseEditor, isEditing);
  useFocusTrap(dialogRef, isEditing);

  return (
    <>
      <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 lg:h-full lg:flex lg:flex-col" aria-labelledby="manage-view-title">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 id="manage-view-title" className="text-3xl font-bold text-aws-dark">Gestionar Mazo</h2>
          <p className="text-gray-600 mt-1">Crea, edita o elimina flashcards</p>
        </div>
        <button
          type="button"
          onClick={onCreateCard}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-aws-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aws-orange focus-visible:ring-offset-2"
        >
          <Plus size={20} aria-hidden="true" /> Nueva Carta
        </button>
      </header>

      <div className="lg:flex-1 lg:min-h-0">
        <section className="space-y-4 lg:min-h-0 lg:flex lg:flex-col" aria-label="Listado y búsqueda del mazo">
          <FlashcardSearch value={search} onChange={onSearchChange} resultCount={cards.length} />
          <div className="lg:flex-1 lg:min-h-0">
            <FlashcardTable cards={cards} deletingId={deletingId} onEdit={onEditCard} onDelete={onDelete} />
          </div>
          <p className="text-sm text-gray-600">
            {search
              ? `Mostrando ${cards.length} de ${totalCards} cartas del mazo.`
              : `Mostrando ${totalCards} cartas del mazo.`}
          </p>
        </section>
      </div>
      </section>

      {editingCard && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/45 flex items-center justify-center p-4"
          role="presentation"
          onClick={onCloseEditor}
        >
          <div
            ref={dialogRef}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            aria-describedby={dialogDescriptionId}
            onClick={(event) => event.stopPropagation()}
          >
            <FlashcardForm
              card={editingCard}
              isSaving={isSaving}
              deletingId={deletingId}
              onClose={onCloseEditor}
              onFieldChange={onFieldChange}
              onSave={onSave}
              onDelete={onDelete}
            />
            <div className="sr-only">
              <h3 id={dialogTitleId}>{editingCard.id ? 'Editar carta' : 'Nueva carta'}</h3>
              <p id={dialogDescriptionId}>Formulario modal para crear o editar una flashcard.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
