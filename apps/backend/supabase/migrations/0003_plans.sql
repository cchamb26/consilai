-- Plans table for storing AI-generated learning plans per teacher & student
-- This migration defines:
-- - plans: one row per plan, owned by a teacher, optionally linked to a student
-- - RLS so teachers can only see and modify their own plans

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  student_id uuid references public.students (id) on delete cascade,

  title text not null,
  objectives text,
  start_date date,
  end_date date,
  status text,

  -- Store milestones as an array of text for simplicity
  milestones text[] default '{}'::text[],

  -- Optional raw/custom prompt used to generate the plan
  custom_prompt text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.plans is
  'AI-generated learning plans owned by a teacher, optionally linked to a student.';

comment on column public.plans.teacher_id is
  'FK to auth.users.id for the owning teacher.';

comment on column public.plans.student_id is
  'FK to public.students.id if this plan is tied to a specific student.';


-- Basic grants for authenticated clients
grant
  select, insert, update, delete
on public.plans
to authenticated;


-- Row Level Security (RLS)
alter table public.plans enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'plans'
      and policyname = 'plans_select_own'
  ) then
    create policy plans_select_own
      on public.plans
      for select
      using (teacher_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'plans'
      and policyname = 'plans_modify_own'
  ) then
    create policy plans_modify_own
      on public.plans
      for all
      using (teacher_id = auth.uid())
      with check (teacher_id = auth.uid());
  end if;
end
$$;


