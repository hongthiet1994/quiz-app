import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

interface AnswerDetail {
  question: string;
  userAnswer: string | null;
  userAnswerText: string | null;
  correctAnswer: string;
  correctAnswerText: string;
  isCorrect: boolean;
}

interface SubmitResultBody {
  username: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  categories: string[];
  answers: AnswerDetail[];
}

export async function POST(request: NextRequest) {
  let body: SubmitResultBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }

  const { username, totalQuestions, correctAnswers, score, categories, answers } = body;

  if (
    typeof username !== 'string' ||
    !username.trim() ||
    typeof totalQuestions !== 'number' ||
    typeof correctAnswers !== 'number' ||
    typeof score !== 'number' ||
    !Array.isArray(categories) ||
    !Array.isArray(answers)
  ) {
    return NextResponse.json({ error: 'Thiếu hoặc sai định dạng dữ liệu' }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('results').insert({
      username: username.trim(),
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      score,
      categories,
      answers,
    });

    if (error) {
      console.error('Supabase insert error:', error.message);
      return NextResponse.json({ error: 'Không thể lưu kết quả' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('submit-result error:', err);
    // Không chặn trải nghiệm người dùng nếu lưu DB thất bại - vẫn trả về lỗi nhẹ
    return NextResponse.json({ error: 'Không thể lưu kết quả' }, { status: 500 });
  }
}
