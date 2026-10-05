create table if not exists public.financial_twin_sync (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.financial_twin_sync enable row level security;

-- Dữ liệu chỉ được đọc/ghi qua API server đã xác thực tài khoản Google.
-- Service role trên Vercel bỏ qua RLS; anon key trên trình duyệt không có policy truy cập.
revoke all on table public.financial_twin_sync from anon, authenticated;

create index if not exists financial_twin_sync_updated_idx
  on public.financial_twin_sync (updated_at desc);
