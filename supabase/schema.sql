-- Chạy đoạn SQL này trong Supabase Dashboard → SQL Editor → New query → Run

create table if not exists results (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  total_questions int not null,
  correct_answers int not null,
  score int not null,
  categories text[] not null default '{}',
  answers jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create index if not exists results_created_at_idx on results (created_at desc);

-- Bật Row Level Security và KHÔNG tạo policy nào cả.
-- Nghĩa là public/anon key không đọc/ghi được bảng này dưới bất kỳ hình thức nào;
-- chỉ có Service Role Key (dùng ở server, không public) mới truy cập được.
alter table results enable row level security;
