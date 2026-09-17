'use client';

import { useState, useEffect } from 'react';
import { Question, QuizSession, QuizResult } from './types';
import QuestionCard from './QuestionCard';
import QuizResultComponent from './QuizResult';

interface QuizContainerProps {
  username: string;
  questions: Question[];
  numQuestions: number;
  categories: string[];
  onBack: () => void;
}

export default function QuizContainer({
  username,
  questions,
  numQuestions,
  categories,
  onBack,
}: QuizContainerProps) {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    // Lọc câu hỏi theo lĩnh vực đã chọn, sau đó chọn ngẫu nhiên số câu mong muốn
    const pool = questions.filter((q) => categories.includes(q.category));
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(numQuestions, pool.length));

    const answers: { [questionId: number]: string | null } = {};
    selected.forEach((q) => {
      answers[q.id] = null;
    });

    setSession({
      username,
      answers,
      currentIndex: 0,
      selectedQuestions: selected,
    });
  }, [username, questions, numQuestions, categories]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Đang tải...</div>
      </div>
    );
  }

  if (result) {
    return <QuizResultComponent result={result} onBack={onBack} />;
  }

  const currentQuestion = session.selectedQuestions[session.currentIndex];
  const progress = ((session.currentIndex + 1) / session.selectedQuestions.length) * 100;

  const handleSelectAnswer = (answer: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.id]: answer,
        },
      };
    });
  };

  const handleNext = () => {
    if (session.currentIndex < session.selectedQuestions.length - 1) {
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentIndex: prev.currentIndex + 1,
        };
      });
    }
  };

  const handlePrev = () => {
    if (session.currentIndex > 0) {
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentIndex: prev.currentIndex - 1,
        };
      });
    }
  };

  const handleSubmit = () => {
    if (!confirm('Bạn chắc chắn muốn nộp bài? Không thể quay lại được!')) {
      return;
    }

    let correctCount = 0;
    const answers = session.selectedQuestions.map((q) => {
      const userAnswer = session.answers[q.id];
      const isCorrect = userAnswer === q.correct_answer;
      if (isCorrect) correctCount++;

      return {
        question: q.question,
        userAnswer: userAnswer || 'Không chọn',
        correctAnswer: q.correct_answer,
        isCorrect,
      };
    });

    const score = Math.round((correctCount / session.selectedQuestions.length) * 100);

    setResult({
      username,
      totalQuestions: session.selectedQuestions.length,
      correctAnswers: correctCount,
      score,
      answers,
    });
  };

  const answeredCount = Object.values(session.answers).filter((a) => a !== null).length;

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-3 sm:py-6 sm:px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-3 gap-2">
            <h2 className="text-base sm:text-xl font-bold text-gray-800 truncate">👤 {username}</h2>
            <span className="text-xs sm:text-sm text-gray-600 shrink-0">
              Câu {session.currentIndex + 1}/{session.selectedQuestions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs sm:text-sm text-gray-600">
            Đã trả lời: {answeredCount}/{session.selectedQuestions.length}
          </div>
        </div>

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={session.answers[currentQuestion.id] || null}
          onSelectAnswer={handleSelectAnswer}
          questionNumber={session.currentIndex + 1}
        />

        {/* Navigation and Submit */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3 mt-4 sm:mt-6">
          <button
            onClick={handlePrev}
            disabled={session.currentIndex === 0}
            className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm sm:text-base font-semibold py-3 rounded-lg transition-colors sm:flex-1"
          >
            ← Lùi
          </button>

          <button
            onClick={handleNext}
            disabled={session.currentIndex === session.selectedQuestions.length - 1}
            className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm sm:text-base font-semibold py-3 rounded-lg transition-colors sm:flex-1"
          >
            Tiến →
          </button>

          <button
            onClick={handleSubmit}
            className="col-span-2 sm:col-span-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm sm:text-base font-semibold py-3 rounded-lg transition-colors sm:flex-1"
          >
            ✓ Nộp Bài
          </button>
        </div>
      </div>
    </div>
  );
}
