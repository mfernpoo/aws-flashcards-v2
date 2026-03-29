import React, { useEffect, useId, useRef } from 'react';
import { BookOpen, Settings, Download, Upload, Trash2, LayoutDashboard, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
  onExport: () => void;
  onReset: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement>;
  importInputId: string;
  importDescriptionId: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onImport,
  onExport,
  onReset,
  triggerRef,
  importInputId,
  importDescriptionId,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const navId = useId();

  const navItems = [
    { id: 'study', label: 'Estudiar', icon: BookOpen, path: '/' },
    { id: 'manage', label: 'Gestionar', icon: Settings, path: '/manage' },
    { id: 'stats', label: 'Estadísticas', icon: LayoutDashboard, path: '/stats' },
  ] as const;

  useEffect(() => {
    if (!isOpen) {
      triggerRef?.current?.focus();
      return;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, triggerRef]);

  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="primary-sidebar"
        ref={panelRef}
        className={clsx(
          'w-64 bg-aws-dark h-screen text-white flex flex-col p-4 fixed left-0 top-0 z-50 transition-transform duration-300 shadow-xl lg:shadow-none',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Navegacion principal"
        aria-modal={isOpen ? true : undefined}
        role={isOpen ? 'dialog' : undefined}
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
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-aws-dark rounded"
            aria-label="Cerrar navegación principal"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-grow space-y-2" aria-labelledby={navId}>
          <h2 id={navId} className="sr-only">
            Secciones principales
          </h2>
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => onClose()}
              className={({ isActive }) =>
                clsx(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-aws-dark',
                  isActive
                    ? 'bg-aws-orange/15 border-aws-orange text-white shadow-sm'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white',
                )
              }
            >
              <item.icon size={20} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <section className="pt-4 border-t border-white/10 space-y-2" aria-label="Acciones del mazo">
          <button
            type="button"
            onClick={() => {
              onImport();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-aws-dark"
            aria-label="Importar mazo desde archivo XLSX o JSON"
            aria-controls={importInputId}
            aria-describedby={importDescriptionId}
          >
            <Upload size={18} aria-hidden="true" />
            Importar XLSX | JSON
          </button>
          <button
            type="button"
            onClick={() => {
              onExport();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-aws-dark"
            aria-label="Exportar mazo en formato JSON"
          >
            <Download size={18} aria-hidden="true" />
            Exportar JSON
          </button>
          <button
            type="button"
            onClick={() => {
              onReset();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-lg transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-aws-dark"
            aria-label="Reiniciar el progreso local del mazo"
          >
            <Trash2 size={18} aria-hidden="true" />
            Reiniciar Progreso
          </button>
        </section>
      </aside>
    </>
  );
};
