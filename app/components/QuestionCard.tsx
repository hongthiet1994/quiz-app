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
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Question */}
      <div className="mb-6">
        <div className="text-sm text-blue-600 font-semibold mb-2">
          Lĩnh vực: {question.category}
        </div>
        <h3 className="text-lg font-bold text-gray-800">
          Câu {questionNumber}. {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50"
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
              className="mt-1 mr-4 cursor-pointer"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{option}.</div>
              <div className="text-gray-700">{question.options[option]}</div>
            </div>
          </label>
        ))}
      </div>

      {/* Info */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
        {selectedAnswer ? '✓ Bạn đã chọn: ' + selectedAnswer : '• Vui lòng chọn một đáp án'}
      </div>
    </div>
  );
}
