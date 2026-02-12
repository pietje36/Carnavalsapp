
import React, { useState } from 'react';
import { GameType, Question, UserStats, Rank } from './types';
import { generateCarnavalQuestions } from './services/geminiService';
import { ConfettiEffect } from './components/ConfettiEffect';
import { TypingGame } from './components/TypingGame';
import { HangmanGame } from './components/HangmanGame';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'home' | 'playing' | 'loading' | 'results'>('home');
  const [currentGameType, setCurrentGameType] = useState<GameType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [stats, setStats] = useState<UserStats>({
    score: 0,
    level: 1,
    questionsAnswered: 0,
    rank: Rank.BEGINNER
  });

  const getRank = (score: number) => {
    if (score > 250) return Rank.EXPERT;
    if (score > 150) return Rank.ADVANCED;
    if (score > 60) return Rank.INTERMEDIATE;
    return Rank.BEGINNER;
  };

  const startLevel = async (type: GameType) => {
    setGameState('loading');
    setCurrentGameType(type);
    const newQuestions = await generateCarnavalQuestions(type);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameState('playing');
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    
    const correct = answer === questions[currentQuestionIndex].correctAnswer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);

    if (correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      updateScore(15);
    } else {
      setStats(prev => ({
        ...prev,
        questionsAnswered: prev.questionsAnswered + 1
      }));
    }
  };

  const updateScore = (points: number) => {
    setStats(prev => {
      const newScore = prev.score + points;
      return {
        ...prev,
        score: newScore,
        questionsAnswered: prev.questionsAnswered + 1,
        rank: getRank(newScore)
      };
    });
  };

  const handleGameComplete = (points: number) => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1500);
    updateScore(points);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setGameState('results');
    }
  };

  const resetGame = () => {
    setGameState('home');
    setCurrentGameType(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-orange-50 to-green-100 p-4 md:p-8">
      <ConfettiEffect active={showConfetti} />

      <header className="max-w-4xl mx-auto flex justify-between items-center mb-8 bg-white/80 backdrop-blur p-4 rounded-2xl shadow-lg border-2 border-orange-200">
        <div className="flex items-center gap-3">
          <button onClick={resetGame} className="text-4xl hover:scale-110 transition-transform">🎭</button>
          <h1 className="text-2xl font-bold text-purple-800 hidden sm:block">Carnaval Quiz-Kanon</h1>
        </div>
        <div className="flex gap-2 sm:gap-4">
          <div className="bg-orange-100 px-3 sm:px-4 py-2 rounded-xl text-orange-800 font-bold border border-orange-300 text-sm sm:text-base">
             ⭐ {stats.score}
          </div>
          <div className="bg-purple-100 px-3 sm:px-4 py-2 rounded-xl text-purple-800 font-bold border border-purple-300 text-sm sm:text-base">
             🏆 {stats.rank}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {gameState === 'home' && (
          <div className="text-center animate-fadeIn">
            <h2 className="text-4xl font-bold text-purple-900 mb-6">Welkom bij het Grootste Feest! 🎊</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button 
                onClick={() => startLevel('quiz')}
                className="group bg-white p-6 rounded-3xl shadow-xl border-4 border-transparent hover:border-yellow-400 transition-all hover:scale-105"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
                <h3 className="text-xl font-bold text-yellow-600 mb-2">Carnavals-Quiz</h3>
                <p className="text-sm text-gray-500">Test je algemene carnavalskennis!</p>
              </button>

              <button 
                onClick={() => startLevel('math')}
                className="group bg-white p-6 rounded-3xl shadow-xl border-4 border-transparent hover:border-orange-400 transition-all hover:scale-105"
              >
                <div className="text-5xl mb-4 group-hover:rotate-12 transition-transform">🧮</div>
                <h3 className="text-xl font-bold text-orange-600 mb-2">Reken-Optocht</h3>
                <p className="text-sm text-gray-500">Carnavalssommen voor groep 8</p>
              </button>

              <button 
                onClick={() => startLevel('language')}
                className="group bg-white p-6 rounded-3xl shadow-xl border-4 border-transparent hover:border-green-400 transition-all hover:scale-105"
              >
                <div className="text-5xl mb-4 group-hover:-rotate-12 transition-transform">📚</div>
                <h3 className="text-xl font-bold text-green-600 mb-2">Taal-Paleis</h3>
                <p className="text-sm text-gray-500">Carnavals-spelling & taal</p>
              </button>

              <button 
                onClick={() => startLevel('typing')}
                className="group bg-white p-6 rounded-3xl shadow-xl border-4 border-transparent hover:border-purple-400 transition-all hover:scale-105"
              >
                <div className="text-5xl mb-4 group-hover:bounce transition-transform">⌨️</div>
                <h3 className="text-xl font-bold text-purple-600 mb-2">Type-Toets</h3>
                <p className="text-sm text-gray-500">Typ de woorden razendsnel</p>
              </button>

              <button 
                onClick={() => startLevel('hangman')}
                className="group bg-white p-6 rounded-3xl shadow-xl border-4 border-transparent hover:border-red-400 transition-all hover:scale-105"
              >
                <div className="text-5xl mb-4 group-hover:rotate-6 transition-transform">🤡</div>
                <h3 className="text-xl font-bold text-red-600 mb-2">Carnavals-Galgje</h3>
                <p className="text-sm text-gray-500">Raad de geheime woorden</p>
              </button>
            </div>
          </div>
        )}

        {gameState === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 border-8 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-6"></div>
            <p className="text-2xl font-bold text-purple-800 animate-pulse">De praalwagens worden versierd...</p>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="animate-slideUp">
            {currentGameType === 'typing' && (
              <TypingGame 
                questions={questions} 
                onComplete={handleGameComplete} 
                onFinish={() => setGameState('results')} 
              />
            )}
            {currentGameType === 'hangman' && (
              <HangmanGame 
                questions={questions} 
                onComplete={handleGameComplete} 
                onFinish={() => setGameState('results')} 
              />
            )}
            {(currentGameType === 'math' || currentGameType === 'language' || currentGameType === 'quiz') && questions.length > 0 && (
              <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl border-4 border-white">
                <div className="flex justify-between items-center mb-6">
                  <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full font-bold">
                    Vraag {currentQuestionIndex + 1} van {questions.length}
                  </span>
                  <div className="w-48 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 leading-snug">
                  {questions[currentQuestionIndex].question}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {questions[currentQuestionIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      disabled={!!selectedAnswer}
                      className={`
                        p-6 rounded-2xl text-xl font-bold transition-all text-left
                        ${!selectedAnswer ? 'bg-gray-50 hover:bg-orange-50 hover:shadow-md border-2 border-gray-100' : ''}
                        ${selectedAnswer === option && isCorrect ? 'bg-green-100 border-2 border-green-500 text-green-800' : ''}
                        ${selectedAnswer === option && !isCorrect ? 'bg-red-100 border-2 border-red-500 text-red-800' : ''}
                        ${selectedAnswer && option === questions[currentQuestionIndex].correctAnswer && !isCorrect ? 'bg-green-50 border-2 border-green-400 text-green-700' : ''}
                      `}
                    >
                      <span className="mr-3 opacity-50">{['A', 'B', 'C', 'D'][idx]}.</span>
                      {option}
                    </button>
                  ))}
                </div>

                {selectedAnswer && (
                  <div className={`p-6 rounded-2xl mb-8 animate-fadeIn ${isCorrect ? 'bg-green-50' : 'bg-orange-50'}`}>
                    <p className="font-bold mb-1">{isCorrect ? '✅ Goed gedaan! Alaaf!' : '❌ Bijna goed!'}</p>
                    <p className="text-gray-700">{questions[currentQuestionIndex].explanation}</p>
                    <button 
                      onClick={nextQuestion}
                      className="mt-6 w-full py-4 bg-purple-600 text-white rounded-xl text-xl font-bold hover:bg-purple-700 transition-colors shadow-lg"
                    >
                      {currentQuestionIndex === questions.length - 1 ? 'Bekijk Resultaten' : 'Volgende Vraag →'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {gameState === 'results' && (
          <div className="text-center bg-white p-10 rounded-3xl shadow-2xl animate-bounceIn">
            <div className="text-8xl mb-6">👑</div>
            <h2 className="text-4xl font-bold text-purple-900 mb-2">Drie Maal Alaaf!</h2>
            <p className="text-2xl text-gray-600 mb-8">Je bent nu een: <span className="text-purple-600 font-bold">{stats.rank}</span></p>
            
            <div className="inline-block bg-orange-50 border-2 border-orange-200 p-8 rounded-3xl mb-8">
              <div className="text-sm text-orange-600 font-bold uppercase tracking-wider mb-2">Totale Score</div>
              <div className="text-6xl font-bold text-orange-700">{stats.score}</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => startLevel(currentGameType!)}
                className="px-8 py-4 bg-purple-600 text-white rounded-2xl text-xl font-bold hover:bg-purple-700 transition-all shadow-lg"
              >
                Nog eens Spelen
              </button>
              <button 
                onClick={resetGame}
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl text-xl font-bold hover:bg-gray-200 transition-all"
              >
                Hoofdmenu
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2025 Carnaval Quiz-Kanon - Voor alle Narren in Groep 8!</p>
      </footer>
    </div>
  );
};

export default App;
