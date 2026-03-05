import React from 'react';
import { BookOpen, Settings, Download, Upload, Trash2, LayoutDashboard } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  activeView: 'study' | 'manage' | 'stats';
  onViewChange: (view: 'study' | 'manage' | 'stats') => void;
  onImport: () => void;
  onExport: () => void;
  onReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onViewChange, 
  onImport, 
  onExport,
  onReset 
}) => {
  const navItems = [
    { id: 'study', label: 'Estudiar', icon: BookOpen },
    { id: 'manage', label: 'Gestionar', icon: Settings },
    { id: 'stats', label: 'Estadísticas', icon: LayoutDashboard },
  ] as const;

  return (
    <div className="w-64 bg-aws-dark h-screen text-white flex flex-col p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 bg-aws-orange rounded flex items-center justify-center font-bold text-white">
          AWS
        </div>
        <h1 className="text-xl font-bold tracking-tight">Flashcards <span className="text-aws-orange">v2</span></h1>
      </div>

      <nav className="flex-grow space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={clsx(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
              activeView === item.id 
                ? "bg-aws-orange text-white" 
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            )}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="pt-4 border-t border-white/10 space-y-2">
        <button 
          onClick={onImport}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/10 hover:text-white rounded-lg transition-colors text-sm"
        >
          <Upload size={18} />
          Importar XLSX
        </button>
        <button 
          onClick={onExport}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/10 hover:text-white rounded-lg transition-colors text-sm"
        >
          <Download size={18} />
          Exportar JSON
        </button>
        <button 
          onClick={onReset}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-sm"
        >
          <Trash2 size={18} />
          Reset a Seed
        </button>
      </div>
    </div>
  );
};
