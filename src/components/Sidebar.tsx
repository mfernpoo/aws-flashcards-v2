import React from 'react';
import { BookOpen, Settings, Download, Upload, Trash2, LayoutDashboard, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
  onExport: () => void;
  onReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onImport,
  onExport,
  onReset,
}) => {
  const navItems = [
    { id: 'study', label: 'Estudiar', icon: BookOpen, path: '/' },
    { id: 'manage', label: 'Gestionar', icon: Settings, path: '/manage' },
    { id: 'stats', label: 'Estadísticas', icon: LayoutDashboard, path: '/stats' },
  ] as const;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={clsx(
          'w-64 bg-aws-dark h-screen text-white flex flex-col p-4 fixed left-0 top-0 z-50 transition-transform duration-300 shadow-xl lg:shadow-none',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-2">
            <div className="w-12 h-8 bg-aws-orange rounded flex items-center justify-center font-bold text-white">
              AWS
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Flashcards <span className="text-aws-orange">v2</span>
            </h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-grow space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => onClose()} // Close sidebar on navigation (mobile)
              className={({ isActive }) =>
                clsx(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium',
                  isActive
                    ? 'bg-aws-orange text-white'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white',
                )
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="pt-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => {
              onImport();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/10 hover:text-white rounded-lg transition-colors text-sm"
          >
            <Upload size={18} />
            Importar XLSX
          </button>
          <button
            onClick={() => {
              onExport();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/10 hover:text-white rounded-lg transition-colors text-sm"
          >
            <Download size={18} />
            Exportar JSON
          </button>
          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-sm"
          >
            <Trash2 size={18} />
            Reset a Seed
          </button>
        </div>
      </div>
    </>
  );
};
