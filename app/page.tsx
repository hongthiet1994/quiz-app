'use client';

import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import QuizContainer from './components/QuizContainer';
import { Question } from './components/types';

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/questions.json')
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading questions:', err);
        setError('Không thể tải câu hỏi. Vui lòng tải lại trang.');
        setLoading(false);
      });
  }, []);

  const handleLogin = (name: string) => {
    setUsername(name);
  };

  const handleBack = () => {
    setUsername(null);
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

  if (!username) {
    return <LoginForm onSubmit={handleLogin} />;
  }

  return <QuizContainer username={username} questions={questions} onBack={handleBack} />;
}
