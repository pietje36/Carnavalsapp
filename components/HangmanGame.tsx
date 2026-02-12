
import React, { useState, useEffect } from 'react';
import { Question } from '../types';

interface HangmanGameProps {
  questions: Question[];
  onComplete: (scoreGain: number) => void;
  onFinish: () => void;
}

export const HangmanGame: React.FC<HangmanGameProps> = ({ questions, onComplete, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const maxGuesses = 8;

  const currentWord = questions[currentIndex]?.correctAnswer.toUpperCase() || "";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const displayWord = currentWord.split('').map(char => 
    guessedLetters.includes(char) ? char : "_"
  );

  const isWon = !displayWord.includes("_");
  const isLost = wrongGuesses >= maxGuesses;

  const handleGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || isWon || isLost) return;

    setGuessedLetters(prev => [...prev, letter]);
    if (!currentWord.includes(letter)) {
      setWrongGuesses(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (isWon) {
      onComplete(10);
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setGuessedLetters([]);
          setWrongGuesses(0);
        } else {
          onFinish();
        }
      }, 1500);
    }
  }, [isWon]);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-orange-200 text-center">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-600">Carnavals Galgje 🤡</h2>
        <div className="text-lg font-bold text-gray-500">
          Levens: {Array(maxGuesses - wrongGuesses).fill('❤️').join('')}
        </div>
      </div>

      <div className="mb-10 text-5xl md:text-6xl font-mono tracking-widest text-purple-800">
        {displayWord.join(' ')}
      </div>

      {isLost ? (
        <div className="mb-6 p-4 bg-red-100 rounded-xl text-red-700 animate-bounce">
          <p className="font-bold">Helaas! Het woord was: {currentWord}</p>
          <button 
            onClick={() => {
              if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setGuessedLetters([]);
                setWrongGuesses(0);
              } else {
                onFinish();
              }
            }}
            className="mt-2 text-sm underline font-bold"
          >
            Volgende Woord
          </button>
        </div>
      ) : isWon ? (
        <div className="mb-6 p-4 bg-green-100 rounded-xl text-green-700 animate-pulse font-bold text-xl">
          Alaaf! Goed geraden! 🎊
        </div>
      ) : null}

      <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
        {alphabet.map(letter => (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={guessedLetters.includes(letter) || isWon || isLost}
            className={`
              p-2 sm:p-4 rounded-xl font-bold text-xl transition-all
              ${guessedLetters.includes(letter) 
                ? (currentWord.includes(letter) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400') 
                : 'bg-purple-50 hover:bg-purple-200 text-purple-700 active:scale-95 shadow-sm border border-purple-100'}
            `}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};
