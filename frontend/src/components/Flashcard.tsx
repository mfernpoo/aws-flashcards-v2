import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard as IFlashcard, Grade } from '../types';
import { RotateCcw } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FlashcardProps {
  card: IFlashcard;
  onGrade: (grade: Grade) => void | Promise<void>;
}

export const Flashcard: React.FC<FlashcardProps> = ({ card, onGrade }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardFaceId = `flashcard-face-${card.id}`;
  const cardBackId = `flashcard-back-${card.id}`;
  const showAnswerButtonRef = useRef<HTMLButtonElement>(null);
  const showQuestionButtonRef = useRef<HTMLButtonElement>(null);
  const gradeHardButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsFlipped(false);
  }, [card.id]);

  useLayoutEffect(() => {
    if (isFlipped) {
      gradeHardButtonRef.current?.focus();
      return;
    }

    showAnswerButtonRef.current?.focus();
  }, [isFlipped, card.id]);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      <div className="w-full h-80 relative group">
        <div
          className={cn(
            'w-full h-full duration-500 preserve-3d transition-transform relative',
            isFlipped && 'rotate-y-180',
          )}
        >
          <article
            id={cardFaceId}
            className="absolute inset-0 backface-hidden bg-white rounded-2xl shadow-xl p-8 flex flex-col border-2 border-transparent group-hover:border-aws-orange transition-colors"
            aria-hidden={isFlipped}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-aws-light text-aws-dark text-xs font-bold rounded uppercase tracking-wider">
                {card.domain || 'General'}
              </span>
              <div className="flex gap-1">
                {card.tags.map((tag) => (
                  <span key={tag} className="text-xs text-aws-blue font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-grow overflow-y-auto pr-1">
              <div className="flex items-start justify-center text-center py-4">
                <h2 className="text-2xl font-semibold text-gray-800 leading-relaxed break-words text-center">
                  {card.front}
                </h2>
              </div>
            </div>
            <div className="text-center text-gray-600 text-sm mt-4 flex items-center justify-center gap-3">
              <span className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                <RotateCcw size={14} aria-hidden="true" /> Frente
              </span>
              <button
                ref={showAnswerButtonRef}
                type="button"
                onClick={() => setIsFlipped(true)}
                className="px-4 py-2 rounded-lg border border-aws-orange/30 bg-aws-orange/10 text-aws-dark font-medium hover:bg-aws-orange/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aws-orange focus-visible:ring-offset-2"
                aria-controls={cardBackId}
                aria-expanded={isFlipped}
              >
                Ver respuesta
              </button>
            </div>
          </article>

          <article
            id={cardBackId}
            className="absolute inset-0 backface-hidden bg-aws-dark text-white rounded-2xl shadow-xl p-8 flex flex-col rotate-y-180 border-2 border-aws-orange"
            aria-hidden={!isFlipped}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-white/10 text-white/80 text-xs font-bold rounded uppercase tracking-wider">
                Respuesta
              </span>
            </div>
            <div className="flex-grow overflow-y-auto pr-1">
              <div className="min-h-full flex items-center justify-center text-center py-4">
                <p className="text-xl leading-relaxed break-words whitespace-pre-wrap">{card.back}</p>
              </div>
            </div>
            <div className="text-center text-white/80 text-sm mt-4 flex items-center justify-center gap-3">
              <span className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white">
                <RotateCcw size={14} aria-hidden="true" /> Respuesta
              </span>
              <button
                ref={showQuestionButtonRef}
                type="button"
                onClick={() => setIsFlipped(false)}
                className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-aws-dark"
                aria-controls={cardFaceId}
                aria-expanded={isFlipped}
              >
                Volver a pregunta
              </button>
            </div>
          </article>
        </div>
      </div>

      <div className="w-full mt-8 relative">
        {/* Botones siempre en el DOM — su tamaño ancla la altura del contenedor */}
        <div
          className={cn(
            'grid grid-cols-3 gap-2 sm:gap-4 w-full transition-opacity duration-300',
            isFlipped ? 'opacity-100' : 'invisible opacity-0',
          )}
          aria-hidden={!isFlipped}
        >
          <button
            ref={gradeHardButtonRef}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              void onGrade(1);
            }}
            tabIndex={isFlipped ? 0 : -1}
            className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-700 rounded-xl transition-colors border border-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
            aria-label="Calificar tarjeta como difícil"
          >
            <span className="font-bold text-sm sm:text-base">Difícil</span>
            <span className="text-[10px] sm:text-xs opacity-70">Hoy mismo</span>
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              void onGrade(2);
            }}
            tabIndex={isFlipped ? 0 : -1}
            className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 rounded-xl transition-colors border border-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            aria-label="Calificar tarjeta como bien"
          >
            <span className="font-bold text-sm sm:text-base">Bien</span>
            <span className="text-[10px] sm:text-xs opacity-70">En unos días</span>
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              void onGrade(3);
            }}
            tabIndex={isFlipped ? 0 : -1}
            className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 bg-green-50 hover:bg-green-100 active:bg-green-200 text-green-700 rounded-xl transition-colors border border-green-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
            aria-label="Calificar tarjeta como fácil"
          >
            <span className="font-bold text-sm sm:text-base">Fácil</span>
            <span className="text-[10px] sm:text-xs opacity-70">En 1-2 semanas</span>
          </button>
        </div>

        {/* Placeholder superpuesto — se desvanece cuando la tarjeta se voltea */}
        <AnimatePresence>
          {!isFlipped && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <div className="px-4 py-2 rounded-full bg-gray-100 text-gray-500 text-sm">
                Voltea la tarjeta para responder
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
