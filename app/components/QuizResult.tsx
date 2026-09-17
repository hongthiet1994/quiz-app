'use client';

import { type QuizResult as QuizResultType } from './types';
import { useState } from 'react';

interface QuizResultProps {
  result: QuizResultType;
  onBack: () => void;
}

export default function QuizResult({ result, onBack }: QuizResultProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getGrade = (score: number) => {
    if (score >= 90) return '🌟 Xuất Sắc';
    if (score >= 80) return '⭐ Tốt';
    if (score >= 70) return '👍 Khá';
    if (score >= 60) return '👌 Đạt';
    return '📚 Cần Cải Thiện';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Score Card */}
        <div className={`${getScoreBgColor(result.score)} rounded-lg shadow-lg p-8 mb-6`}>
          <h1 className="text-4xl font-bold text-center mb-2">
            ✅ Nộp Bài Thành Công
          </h1>
          <p className="text-center text-gray-700 mb-6">
            Xin chào, <strong>{result.username}</strong>!
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Tổng Số Câu</div>
              <div className="text-3xl font-bold text-blue-600">
                {result.totalQuestions}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Trả Lời Đúng</div>
              <div className="text-3xl font-bold text-green-600">
                {result.correctAnswers}
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-lg p-6 text-center ${getScoreBgColor(result.score)}`}>
            <div className="text-sm text-gray-600 mb-2">Điểm Số</div>
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.score)}`}>
              {result.score}%
            </div>
            <div className="text-xl font-semibold">{getGrade(result.score)}</div>
          </div>
        </div>

        {/* Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 rounded-lg border border-gray-300 transition-colors mb-4"
        >
          {showDetails ? '▼ Ẩn Chi Tiết' : '▶ Xem Chi Tiết Câu Trả Lời'}
        </button>

        {/* Detailed Results */}
        {showDetails && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Chi Tiết Từng Câu:</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {result.answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    answer.isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="font-semibold text-gray-800 mb-2">
                    Câu {index + 1}. {answer.question}
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="text-gray-700">
                      Bạn chọn: <strong>{answer.userAnswer}</strong>
                    </div>
                    <div
                      className={
                        answer.isCorrect
                          ? 'text-green-700'
                          : 'text-red-700'
                      }
                    >
                      Đáp án đúng: <strong>{answer.correctAnswer}</strong>
                    </div>
                    <div className="mt-1">
                      {answer.isCorrect ? '✅ Chính Xác' : '❌ Sai'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            🔄 Thi Lại
          </button>
          <button
            onClick={() => {
              const text = `Tôi vừa hoàn thành bài thi với kết quả: ${result.score}% (${result.correctAnswers}/${result.totalQuestions} câu)`;
              navigator.clipboard.writeText(text);
              alert('Đã sao chép kết quả!');
            }}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            📋 Sao Chép Kết Quả
          </button>
        </div>
      </div>
    </div>
  );
}
