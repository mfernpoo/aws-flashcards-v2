import React, { useEffect, useId, useRef, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
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
  const location = useLocation();
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const importInputId = useId();
  const importDescriptionId = useId();
  const { fileInputRef, requestImport, handleFileChange, exportDeck } = useDeckTransfer({
    cards,
    importCards,
    onNotify: setNotification,
  });
  const isManageRoute = location.pathname === '/manage';

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
    setNotification({ type: 'success', message: 'Progreso local reiniciado.' });
  };

  if (isLoading) {
    return (
      <main
        className="flex items-center justify-center h-screen bg-aws-dark"
        aria-busy="true"
        aria-live="polite"
      >
        <div role="status" className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 border-4 border-aws-orange border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          ></div>
          <p className="text-white font-medium">Cargando AWS Flashcards...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onExport={exportDeck}
        onImport={requestImport}
        onReset={() => setIsResetDialogOpen(true)}
        triggerRef={menuButtonRef}
        importInputId={importInputId}
        importDescriptionId={importDescriptionId}
      />

      <FileImportInput
        inputRef={fileInputRef}
        onChange={handleFileChange}
        inputId={importInputId}
        descriptionId={importDescriptionId}
      />

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <header className="lg:hidden bg-aws-dark text-white p-4 sticky top-0 z-30 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-6 bg-aws-orange rounded flex items-center justify-center font-bold text-white text-xs">
              AWS
            </div>
            <h1 className="text-lg font-bold">Flashcards v2</h1>
          </div>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-controls="primary-sidebar"
            aria-expanded={isSidebarOpen}
            aria-label="Abrir navegación principal"
            className="p-1 hover:bg-white/10 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-aws-dark"
          >
            <Menu size={24} />
          </button>
        </header>

        <main
          className={`flex-grow p-4 lg:px-8 lg:py-10 xl:px-10 ${isManageRoute ? 'lg:overflow-hidden' : 'overflow-y-auto'}`}
          aria-label="Contenido principal"
        >
          <div className="w-full max-w-7xl mx-auto">
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
          </div>
        </main>
      </div>

      {notification && <Toast notification={notification} onClose={() => setNotification(null)} />}

      {isResetDialogOpen && (
        <ConfirmDialog
          title="Reiniciar progreso"
          message="Se perderá el progreso local actual y las cartas volverán a su estado inicial de estudio en este dispositivo."
          confirmLabel="Reiniciar progreso"
          onConfirm={handleResetConfirm}
          onCancel={() => setIsResetDialogOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
