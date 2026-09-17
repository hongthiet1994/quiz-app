'use client';

import { useMemo, useState } from 'react';
import { Question, QuizConfig } from './types';

interface LoginFormProps {
  questions: Question[];
  onSubmit: (config: QuizConfig) => void;
}

const DEFAULT_NUM_QUESTIONS = 50;

export default function LoginForm({ questions, onSubmit }: LoginFormProps) {
  const categoryCounts = useMemo(() => {
    const counts: { [category: string]: number } = {};
    questions.forEach((q) => {
      counts[q.category] = (counts[q.category] || 0) + 1;
    });
    return counts;
  }, [questions]);

  const allCategories = useMemo(() => {
    // Sắp xếp theo số thứ tự ở đầu tên (vd "2. ..." trước "10. ..."),
    // vì sort chuỗi mặc định sẽ xếp "10." trước "2."
    const leadingNumber = (name: string) => {
      const match = name.match(/^(\d+)\./);
      return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
    };
    return Object.keys(categoryCounts).sort((a, b) => leadingNumber(a) - leadingNumber(b));
  }, [categoryCounts]);

  const [username, setUsername] = useState('');
  const [numQuestions, setNumQuestions] = useState(String(DEFAULT_NUM_QUESTIONS));
  const [selectedCategories, setSelectedCategories] = useState<string[]>(allCategories);
  const [error, setError] = useState('');

  const availableCount = selectedCategories.reduce(
    (sum, cat) => sum + (categoryCounts[cat] || 0),
    0
  );

  const isAllSelected = selectedCategories.length === allCategories.length;

  const toggleCategory = (category: string) => {
    setError('');
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleSelectAll = () => {
    setError('');
    setSelectedCategories(isAllSelected ? [] : allCategories);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = username.trim();

    if (!trimmedName) {
      setError('Vui lòng nhập tên của bạn');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Tên phải có ít nhất 2 ký tự');
      return;
    }

    if (selectedCategories.length === 0) {
      setError('Vui lòng chọn ít nhất một lĩnh vực');
      return;
    }

    const parsedNum = parseInt(numQuestions, 10);

    if (!parsedNum || parsedNum < 1) {
      setError('Số câu hỏi phải lớn hơn 0');
      return;
    }

    if (parsedNum > availableCount) {
      setError(
        `Số câu hỏi vượt quá số câu hiện có trong các lĩnh vực đã chọn (tối đa ${availableCount} câu)`
      );
      return;
    }

    onSubmit({
      username: trimmedName,
      numQuestions: parsedNum,
      categories: selectedCategories,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-3 py-6 sm:px-4">
      <div className="bg-white rounded-lg shadow-2xl p-5 sm:p-8 w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
          📝 Thi Thử Trực Tuyến
        </h1>
        <p className="text-center text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          {questions.length}+ Câu Hỏi - {allCategories.length} Lĩnh Vực
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Họ và tên */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Nhập Họ và Tên
            </label>
            <input
              id="username"
              type="text"
              inputMode="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Ví dụ: Nguyễn Văn A"
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Số câu hỏi */}
          <div>
            <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-2">
              Số Câu Hỏi
            </label>
            <input
              id="numQuestions"
              type="number"
              inputMode="numeric"
              min={1}
              max={availableCount || undefined}
              value={numQuestions}
              onChange={(e) => {
                setNumQuestions(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Tối đa {availableCount} câu (theo lĩnh vực đã chọn bên dưới)
            </p>
          </div>

          {/* Chọn lĩnh vực */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Chọn Lĩnh Vực</label>
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>
            </div>
            <div className="border border-gray-300 rounded-lg max-h-56 overflow-y-auto divide-y divide-gray-100">
              {allCategories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-blue-50 active:bg-blue-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="h-4 w-4 shrink-0 cursor-pointer"
                  />
                  <span className="flex-1 min-w-0 text-sm text-gray-700 break-words">
                    {category}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {categoryCounts[category]} câu
                  </span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            Bắt Đầu Thi Thử
          </button>
        </form>

        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">📌 Thông Tin:</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Mặc định {DEFAULT_NUM_QUESTIONS} câu, có thể tuỳ chỉnh số lượng</li>
            <li>• Mặc định thi toàn bộ lĩnh vực, có thể chọn riêng</li>
            <li>• Bạn có thể lùi/tiến để xem các câu hỏi</li>
            <li>• Có thể sửa đáp án bất kỳ lúc nào trước khi nộp</li>
            <li>• Kết quả sẽ hiển thị sau khi nộp bài</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
