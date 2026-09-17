'use client';

import { useState } from 'react';

interface LoginFormProps {
  onSubmit: (username: string) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();

    if (!trimmed) {
      setError('Vui lòng nhập tên của bạn');
      return;
    }

    if (trimmed.length < 2) {
      setError('Tên phải có ít nhất 2 ký tự');
      return;
    }

    onSubmit(trimmed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          📝 Thi Thử Trực Tuyến
        </h1>
        <p className="text-center text-gray-600 mb-8">
          11 Lĩnh Vực - 1350+ Câu Hỏi
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Nhập Họ và Tên
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Ví dụ: Nguyễn Văn A"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            Bắt Đầu Thi Thử
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">📌 Thông Tin:</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Mỗi bài thi có 50 câu hỏi được chọn ngẫu nhiên</li>
            <li>• Bạn có thể lùi/tiến để xem các câu hỏi</li>
            <li>• Có thể sửa đáp án bất kỳ lúc nào trước khi nộp</li>
            <li>• Kết quả sẽ hiển thị sau khi nộp bài</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
