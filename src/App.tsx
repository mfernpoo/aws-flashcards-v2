import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Sidebar } from './components/Sidebar';
import { FileImportInput } from './components/FileImportInput';
import { Toast } from './components/Toast';
import { ManageViewContainer } from './containers/ManageViewContainer';
import { StatsViewContainer } from './containers/StatsViewContainer';
import { StudyViewContainer } from './containers/StudyViewContainer';
import { useDeckTransfer } from './hooks/useDeckTransfer';
import { useFlashcards } from './hooks/useFlashcards';
import { UiNotification } from './types';

function App() {
  const {
    cards,
    isLoading,
    addCard,
    updateCard,
    deleteCard,
    gradeCard,
    importCards,
    factoryReset,
  } = useFlashcards();

  const [notification, setNotification] = useState<UiNotification | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const { fileInputRef, requestImport, handleFileChange, exportDeck } = useDeckTransfer({
    cards,
    importCards,
    onNotify: setNotification,
  });

  useEffect(() => {
    if (!notification) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setNotification(null);
    }, 3500);

    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  const handleResetConfirm = async () => {
    await factoryReset();
    setIsResetDialogOpen(false);
    setNotification({ type: 'success', message: 'Mazo reiniciado a la semilla inicial.' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-aws-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-aws-orange border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-medium">Cargando AWS Flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        onExport={exportDeck}
        onImport={requestImport}
        onReset={() => setIsResetDialogOpen(true)}
      />

      <FileImportInput inputRef={fileInputRef} onChange={handleFileChange} />

      <main className="flex-grow ml-64 p-8 lg:p-12 overflow-y-auto">
        <Routes>
          <Route path="/" element={<StudyViewContainer cards={cards} onGrade={gradeCard} />} />
          <Route
            path="/manage"
            element={
              <ManageViewContainer
                cards={cards}
                onAdd={addCard}
                onUpdate={updateCard}
                onDelete={deleteCard}
              />
            }
          />
          <Route path="/stats" element={<StatsViewContainer cards={cards} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {notification && <Toast notification={notification} onClose={() => setNotification(null)} />}

      {isResetDialogOpen && (
        <ConfirmDialog
          title="Resetear mazo"
          message="Se perderá el progreso actual y se volverá a cargar la semilla inicial."
          confirmLabel="Resetear"
          onConfirm={handleResetConfirm}
          onCancel={() => setIsResetDialogOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
