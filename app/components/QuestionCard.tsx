'use client';

import { Question } from './types';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  questionNumber: number;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  questionNumber,
}: QuestionCardProps) {
  const options = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      {/* Question */}
      <div className="mb-4 sm:mb-6">
        <div className="text-xs sm:text-sm text-blue-600 font-semibold mb-2">
          Lĩnh vực: {question.category}
        </div>
        <h3 className="text-base sm:text-lg font-bold text-gray-800 leading-snug">
          Câu {questionNumber}. {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-2.5 sm:space-y-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-start p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all active:bg-blue-50 hover:bg-blue-50"
            style={{
              borderColor: selectedAnswer === option ? '#2563eb' : '#e5e7eb',
              backgroundColor: selectedAnswer === option ? '#eff6ff' : 'transparent',
            }}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option}
              checked={selectedAnswer === option}
              onChange={() => onSelectAnswer(option)}
              className="mt-1 mr-3 sm:mr-4 h-4 w-4 shrink-0 cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 text-sm sm:text-base">{option}.</div>
              <div className="text-gray-700 text-sm sm:text-base break-words">{question.options[option]}</div>
            </div>
          </label>
        ))}
      </div>

      {/* Info */}
      <div className="mt-4 sm:mt-6 p-3 bg-blue-50 rounded-lg text-xs sm:text-sm text-blue-700">
        {selectedAnswer ? '✓ Bạn đã chọn: ' + selectedAnswer : '• Vui lòng chọn một đáp án'}
      </div>
    </div>
  );
}
