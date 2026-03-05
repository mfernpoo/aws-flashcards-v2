import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard as IFlashcard, Grade } from '../types';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FlashcardProps {
  card: IFlashcard;
  onGrade: (grade: Grade) => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({ card, onGrade }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [card.id]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div 
        className="w-full h-80 relative cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={cn(
          "w-full h-full duration-500 preserve-3d transition-transform relative",
          isFlipped && "rotate-y-180"
        )}>
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-2xl shadow-xl p-8 flex flex-col border-2 border-transparent group-hover:border-aws-orange transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-aws-light text-aws-dark text-xs font-bold rounded uppercase tracking-wider">
                {card.domain || 'General'}
              </span>
              <div className="flex gap-1">
                {card.tags.map(tag => (
                  <span key={tag} className="text-xs text-aws-blue font-medium">#{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex-grow flex items-center justify-center text-center">
              <h3 className="text-2xl font-semibold text-gray-800 leading-relaxed">
                {card.front}
              </h3>
            </div>
            <div className="text-center text-gray-400 text-sm mt-4 flex items-center justify-center gap-2">
              <RotateCcw size={14} /> Haz clic para voltear
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden bg-aws-dark text-white rounded-2xl shadow-xl p-8 flex flex-col rotate-y-180 border-2 border-aws-orange">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-white/10 text-white/80 text-xs font-bold rounded uppercase tracking-wider">
                Respuesta
              </span>
            </div>
            <div className="flex-grow flex items-center justify-center text-center overflow-auto">
              <p className="text-xl leading-relaxed">
                {card.back}
              </p>
            </div>
            <div className="text-center text-white/40 text-sm mt-4">
              ¿Qué tan difícil fue?
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFlipped && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="grid grid-cols-3 gap-4 w-full mt-8"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); onGrade(1); }}
              className="flex flex-col items-center gap-2 p-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors border border-red-200"
            >
              <span className="font-bold">Difícil</span>
              <span className="text-xs opacity-70">Hoy mismo</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onGrade(2); }}
              className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors border border-blue-200"
            >
              <span className="font-bold">Bien</span>
              <span className="text-xs opacity-70">En unos días</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onGrade(3); }}
              className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors border border-green-200"
            >
              <span className="font-bold">Fácil</span>
              <span className="text-xs opacity-70">En 1-2 semanas</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
