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

  const filteredCards = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return cards.filter((card) => {
      return (
        card.front.toLowerCase().includes(normalizedSearch) ||
        card.back.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [cards, search]);

  const saveCard = async () => {
    if (!editingCard?.front || !editingCard?.back) {
      return;
    }

    if (editingCard.id) {
      await onUpdate(editingCard as Flashcard);
    } else {
      await onAdd(editingCard);
    }

    setEditingCard(null);
  };

  const deleteCard = async (id: string) => {
    await onDelete(id);

    if (editingCard?.id === id) {
      setEditingCard(null);
    }
  };

  return (
    <ManageView
      cards={filteredCards}
      totalCards={cards.length}
      search={search}
      editingCard={editingCard}
      onSearchChange={setSearch}
      onCreateCard={() => setEditingCard({ front: '', back: '', tags: [], domain: '' })}
      onEditCard={setEditingCard}
      onCloseEditor={() => setEditingCard(null)}
      onFrontChange={(front) => setEditingCard((current) => (current ? { ...current, front } : current))}
      onBackChange={(back) => setEditingCard((current) => (current ? { ...current, back } : current))}
      onDomainChange={(domain) => setEditingCard((current) => (current ? { ...current, domain } : current))}
      onTagsChange={(tags) =>
        setEditingCard((current) =>
          current
            ? {
                ...current,
                tags: tags
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              }
            : current,
        )
      }
      onSave={saveCard}
      onDelete={deleteCard}
    />
  );
};
