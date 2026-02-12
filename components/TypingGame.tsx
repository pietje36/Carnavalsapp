
import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';

interface TypingGameProps {
  questions: Question[];
  onComplete: (scoreGain: number) => void;
  onFinish: () => void;
}

export const TypingGame: React.FC<TypingGameProps> = ({ questions, onComplete, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentWord = questions[currentIndex]?.question || '';

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!startTime) setStartTime(Date.now());
    
    setInputValue(val);

    if (val === currentWord) {
      const timeTaken = (Date.now() - (startTime || Date.now())) / 1000;
      const bonus = Math.max(1, Math.floor(10 - timeTaken));
      onComplete(5 + bonus);
      
      setInputValue('');
      setStartTime(null);
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onFinish();
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-xl border-4 border-purple-200">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-purple-800 mb-2">Typ het carnavalswoord:</h2>
        <div className="relative inline-block text-5xl md:text-7xl font-mono tracking-widest py-4">
          {/* Background word for reference */}
          <span className="text-gray-200 select-none">{currentWord}</span>
          
          {/* Overlay for typed characters */}
          <div className="absolute top-4 left-0 w-full text-left">
            {currentWord.split('').map((char, i) => {
              let color = 'text-transparent';
              if (i < inputValue.length) {
                color = inputValue[i] === char ? 'text-green-500' : 'text-red-500';
              }
              return (
                <span key={i} className={color}>
                  {char}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="w-full max-w-md p-4 text-2xl text-center border-4 border-purple-400 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200"
        placeholder="Begin met typen..."
        autoComplete="off"
        autoFocus
      />

      <div className="mt-8 grid grid-cols-2 gap-4 w-full text-center">
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
          <p className="text-sm font-bold text-orange-600 uppercase">Voortgang</p>
          <p className="text-2xl font-bold text-orange-800">{currentIndex + 1} / {questions.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <p className="text-sm font-bold text-green-600 uppercase">Huidig Woord</p>
          <p className="text-xl font-bold text-green-800 truncate">{currentWord}</p>
        </div>
      </div>
    </div>
  );
};
