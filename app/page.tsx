'use client';

import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import QuizContainer from './components/QuizContainer';
import { Question, QuizConfig } from './components/types';

const REMOVED_CATEGORY_NUMBERS = new Set(['1', '11', '14']);

const isRemovedCategory = (category: string) => {
  const match = category.match(/^(\d+)\./);
  return match ? REMOVED_CATEGORY_NUMBERS.has(match[1]) : false;
};

export default function Home() {
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/questions.json')
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions.filter((question: Question) => !isRemovedCategory(question.category)));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading questions:', err);
        setError('Không thể tải câu hỏi. Vui lòng tải lại trang.');
        setLoading(false);
      });
  }, []);

  const handleLogin = (newConfig: QuizConfig) => {
    setConfig(newConfig);
  };

  const handleBack = () => {
    setConfig(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-center">
          <div className="text-2xl font-bold mb-2">⏳ Đang tải...</div>
          <p>Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">❌ Lỗi</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Tải Lại Trang
          </button>
        </div>
      </div>
    );
  }

  if (!config) {
    return <LoginForm questions={questions} onSubmit={handleLogin} />;
  }

  return (
    <QuizContainer
      username={config.username}
      questions={questions}
      numQuestions={config.numQuestions}
      categories={config.categories}
      onBack={handleBack}
    />
  );
}
