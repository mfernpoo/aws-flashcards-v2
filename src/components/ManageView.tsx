import React from 'react';
import { Flashcard as IFlashcard } from '../types';
import { Plus } from 'lucide-react';
import { FlashcardSearch } from './manage/FlashcardSearch';
import { FlashcardTable } from './manage/FlashcardTable';
import { FlashcardForm } from './manage/FlashcardForm';

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
          <FlashcardSearch value={search} onChange={onSearchChange} />
          <FlashcardTable cards={cards} onEdit={onEditCard} onDelete={onDelete} />
        </div>

        <div className="lg:col-span-1">
          {editingCard ? (
            <FlashcardForm
              card={editingCard}
              onClose={onCloseEditor}
              onFrontChange={onFrontChange}
              onBackChange={onBackChange}
              onDomainChange={onDomainChange}
              onTagsChange={onTagsChange}
              onSave={onSave}
              onDelete={onDelete}
            />
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
