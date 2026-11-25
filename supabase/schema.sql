-- הרצת קובץ זה ב-Supabase SQL Editor יוצרת טבלת בדיקה לשלב ג1
-- לצורך בדיקות הקריאה/כתיבה מקצה לקצה בין Frontend -> Backend -> Supabase.

create table if not exists public.infra_checks (
  id bigint generated always as identity primary key,
  member_name text not null,
  action_note text not null,
  created_at timestamptz not null default now()
);

-- הכנסת רשומת בדיקה ראשונית
insert into public.infra_checks (member_name, action_note)
values ('System Init', 'טבלת בדיקת תשתית שלב ג1 הוקמה בהצלחה');

-- מדיניות גישה בסיסית לשלב הבדיקה הראשוני והרשאות ל-anon / authenticated
alter table public.infra_checks disable row level security;
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.infra_checks to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
