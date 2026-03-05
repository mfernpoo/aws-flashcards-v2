import React, { useState, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { StudyView } from './components/StudyView';
import { ManageView } from './components/ManageView';
import { useFlashcards } from './hooks/useFlashcards';
import { dbInstance } from './utils/db';
import * as XLSX from 'xlsx';

function App() {
  const { 
    cards, 
    dueCards, 
    isLoading, 
    filters, 
    setFilters, 
    addCard, 
    updateCard, 
    deleteCard, 
    gradeCard,
    factoryReset,
    refresh
  } = useFlashcards();

  const [activeView, setActiveView] = useState<'study' | 'manage' | 'stats'>('study');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    const deckName = await dbInstance.getMeta<string>('deckName') || 'AWS Flashcards';
    const payload = { version: 2, deckName, cards };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aws-flashcards-v2-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = event.target?.result;
      if (!data) return;

      if (file.name.endsWith('.json')) {
        const obj = JSON.parse(data as string);
        for (const c of (obj.cards || [])) {
          await addCard(c);
        }
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet) as any[];
        
        for (const r of rows) {
          const front = r.front || r.frente || '';
          const back = r.back || r.reverso || r.respuesta || '';
          if (!front || !back) continue;
          
          await addCard({
            front,
            back,
            domain: r.domain || r.dominio || '',
            tags: String(r.tags || r.tag || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
          });
        }
      }
      alert('Importación completada');
      refresh();
    };

    if (file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
    e.target.value = '';
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
        activeView={activeView}
        onViewChange={setActiveView}
        onExport={handleExport}
        onImport={handleImport}
        onReset={() => {
          if (confirm('¿Estás seguro de resetear todo el mazo? Se perderá el progreso.')) {
            factoryReset();
          }
        }}
      />

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onFileChange} 
        accept=".json,.xlsx,.xls" 
        className="hidden" 
      />

      <main className="flex-grow ml-64 p-8 lg:p-12 overflow-y-auto">
        {activeView === 'study' && (
          <StudyView 
            dueCards={dueCards}
            allCards={cards}
            filters={filters}
            onFilterChange={(f) => setFilters({ ...filters, ...f })}
            onGrade={gradeCard}
          />
        )}

        {activeView === 'manage' && (
          <ManageView 
            cards={cards}
            onAdd={addCard}
            onUpdate={updateCard}
            onDelete={deleteCard}
          />
        )}

        {activeView === 'stats' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold text-aws-dark mb-8">Estadísticas de Aprendizaje</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                 <p className="text-xs font-bold text-gray-400 uppercase mb-1">Caja 1 (Nuevo)</p>
                 <p className="text-2xl font-bold text-red-500">{cards.filter(c => c.srs.box === 1).length}</p>
               </div>
               <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                 <p className="text-xs font-bold text-gray-400 uppercase mb-1">Caja 2</p>
                 <p className="text-2xl font-bold text-orange-500">{cards.filter(c => c.srs.box === 2).length}</p>
               </div>
               <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                 <p className="text-xs font-bold text-gray-400 uppercase mb-1">Caja 3</p>
                 <p className="text-2xl font-bold text-blue-500">{cards.filter(c => c.srs.box === 3).length}</p>
               </div>
               <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                 <p className="text-xs font-bold text-gray-400 uppercase mb-1">Caja 4/5 (Aprendido)</p>
                 <p className="text-2xl font-bold text-green-500">{cards.filter(c => c.srs.box >= 4).length}</p>
               </div>
            </div>
            
            <div className="mt-12 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
               <h3 className="text-lg font-bold mb-6">Progreso por Dominio</h3>
               <div className="space-y-6">
                  {Array.from(new Set(cards.map(c => c.domain).filter(Boolean))).map(domain => {
                    const domainCards = cards.filter(c => c.domain === domain);
                    const learned = domainCards.filter(c => c.srs.box >= 4).length;
                    const percent = Math.round((learned / domainCards.length) * 100);
                    return (
                      <div key={domain}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-bold text-gray-700">{domain}</span>
                          <span className="text-gray-400">{percent}% ({learned}/{domainCards.length})</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-aws-orange h-full transition-all duration-1000" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
