-- הרצת קובץ זה ב-Supabase SQL Editor יוצרת טבלת בדיקה לשלב ג1
-- וכן טבלת בסיס ראשונית לאירועים לצורך בדיקות הקריאה/כתיבה מקצה לקצה.

create table if not exists public.infra_checks (
  id bigint generated always as identity primary key,
  member_name text not null,
  action_note text not null,
  created_at timestamptz not null default now()
);

-- הכנסת רשומת בדיקה ראשונית
insert into public.infra_checks (member_name, action_note)
values ('System Init', 'טבלת בדיקת תשתית שלב ג1 הוקמה בהצלחה');

-- מדיניות גישה בסיסית לשלב הבדיקה הראשוני (RLS כבוי זמנית לטבלת הבדיקה או פתוח לבדיקת Dev)
alter table public.infra_checks disable row level security;
