-- Additional student profile fields for ConsilAI
-- This migration extends the students table to match the frontend model:
-- - email
-- - issues (text[])
-- - strengths (text[])
-- - goals (text[])
-- - avatar (emoji or small string)

alter table public.students
  add column if not exists email text,
  add column if not exists issues text[] default '{}'::text[],
  add column if not exists strengths text[] default '{}'::text[],
  add column if not exists goals text[] default '{}'::text[],
  add column if not exists avatar text;

comment on column public.students.email is
  'Student email address used in the UI.';

comment on column public.students.issues is
  'Array of focus areas / challenges for this student.';

comment on column public.students.strengths is
  'Array of strengths for this student.';

comment on column public.students.goals is
  'Array of learning goals for this student.';

comment on column public.students.avatar is
  'Emoji or short code used as the student avatar in the UI.';


