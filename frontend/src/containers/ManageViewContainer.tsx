import React, { useMemo, useState } from 'react';
import { Flashcard } from '../types';
import { ManageView } from '../components/ManageView';

interface ManageViewContainerProps {
  cards: Flashcard[];
  onAdd: (card: Partial<Flashcard>) => Promise<void>;
  onUpdate: (card: Flashcard) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ManageViewContainer: React.FC<ManageViewContainerProps> = ({
  cards,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [search, setSearch] = useState('');
  const [editingCard, setEditingCard] = useState<Partial<Flashcard> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredCards = useMemo(() => {
    const normalizedSearch = search.toLowerCase();
    return cards.filter(
      (card) =>
        card.front.toLowerCase().includes(normalizedSearch) ||
        card.back.toLowerCase().includes(normalizedSearch),
    );
  }, [cards, search]);

  const handleFieldChange = (field: 'front' | 'back' | 'domain' | 'tags', value: string) => {
    setEditingCard((current) => {
      if (!current) return current;
      if (field === 'tags') {
        return { ...current, tags: value.split(',').map((t) => t.trim()).filter(Boolean) };
      }
      return { ...current, [field]: value };
    });
  };

  const saveCard = async () => {
    if (!editingCard?.front || !editingCard?.back) return;
    setIsSaving(true);
    try {
      if (editingCard.id) {
        await onUpdate(editingCard as Flashcard);
      } else {
        await onAdd(editingCard);
      }
      setEditingCard(null);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCard = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
      if (editingCard?.id === id) setEditingCard(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ManageView
      cards={filteredCards}
      totalCards={cards.length}
      search={search}
      editingCard={editingCard}
      isSaving={isSaving}
      deletingId={deletingId}
      onSearchChange={setSearch}
      onCreateCard={() => setEditingCard({ front: '', back: '', tags: [], domain: '' })}
      onEditCard={setEditingCard}
      onCloseEditor={() => setEditingCard(null)}
      onFieldChange={handleFieldChange}
      onSave={saveCard}
      onDelete={deleteCard}
    />
  );
};
