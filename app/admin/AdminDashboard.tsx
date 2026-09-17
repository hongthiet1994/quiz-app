'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AnswerDetail {
  question: string;
  userAnswer: string | null;
  userAnswerText: string | null;
  correctAnswer: string;
  correctAnswerText: string;
  isCorrect: boolean;
}

export interface AdminResultRow {
  id: string;
  username: string;
  total_questions: number;
  correct_answers: number;
  score: number;
  categories: string[];
  answers: AnswerDetail[];
  created_at: string;
}

interface AdminDashboardProps {
  results: AdminResultRow[];
}

export default function AdminDashboard({ results }: AdminDashboardProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return results;
    return results.filter((r) => r.username.toLowerCase().includes(term));
  }, [results, search]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            📊 Kết Quả Thi Thử ({results.length})
          </h1>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-sm bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            Đăng Xuất
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên..."
          className="w-full mb-4 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-gray-500">
            Chưa có kết quả nào.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((row) => {
              const isExpanded = expandedId === row.id;
              return (
                <div key={row.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : row.id)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-800 truncate">{row.username}</div>
                      <div className="text-xs text-gray-500">{formatDate(row.created_at)}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {row.categories.length} lĩnh vực đã chọn
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div
                        className={`text-2xl font-bold ${
                          row.score >= 80
                            ? 'text-green-600'
                            : row.score >= 60
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {row.score}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {row.correct_answers}/{row.total_questions} đúng
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100 p-4 space-y-3 max-h-96 overflow-y-auto">
                      <div className="text-xs text-gray-500">
                        Lĩnh vực: {row.categories.join(', ')}
                      </div>
                      {row.answers.map((answer, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border-l-4 text-sm ${
                            answer.isCorrect
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                          }`}
                        >
                          <div className="font-semibold text-gray-800 mb-1 break-words">
                            Câu {index + 1}. {answer.question}
                          </div>
                          <div className="text-gray-700 break-words">
                            Đã chọn:{' '}
                            <strong>
                              {answer.userAnswerText
                                ? `${answer.userAnswer}. ${answer.userAnswerText}`
                                : answer.userAnswer}
                            </strong>
                          </div>
                          <div className="text-gray-700 break-words">
                            Đáp án đúng:{' '}
                            <strong>
                              {answer.correctAnswer}. {answer.correctAnswerText}
                            </strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
