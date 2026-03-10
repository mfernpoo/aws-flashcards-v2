import React from 'react';
import { Search } from 'lucide-react';

interface FlashcardSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const FlashcardSearch: React.FC<FlashcardSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Buscar en el mazo..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-aws-orange transition-all shadow-sm"
      />
    </div>
  );
};
