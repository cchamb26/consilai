-- Core schema for ConsilAI classroom & behavior tracking
-- This migration defines:
-- - Classrooms managed by each teacher (Supabase auth user)
-- - Student profiles belonging to a classroom
-- - Student-level “past occurrences” (can target one or many students)
-- - Class-level “occurrences” tied to an entire classroom
-- - Strict RLS so teachers only see their own data
-- - RPC helpers for creating occurrences

----------------------------
-- Extensions
----------------------------

-- Supabase already has pgcrypto in most projects, but this is safe
create extension if not exists "pgcrypto";

----------------------------
-- Tables
----------------------------

-- Each classroom belongs to a single teacher (Supabase auth user)
create table if not exists public.classrooms (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.classrooms is
  'Classrooms managed by a teacher (Supabase auth user).';

comment on column public.classrooms.teacher_id is
  'FK to auth.users.id for the owning teacher.';


-- Each student belongs to one classroom (and therefore one teacher)
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  classroom_id uuid not null references public.classrooms (id) on delete cascade,

  -- Core profile fields
  name text not null,
  grade text,
  age integer,
  behavioral_notes text,

  -- Optional fields that can support the 3D/seat map UI
  seat_row integer,
  seat_col integer,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.students is
  'Student profiles belonging to a classroom (and teacher).';

comment on column public.students.behavioral_notes is
  'Free-form notes about behavior / context entered by the teacher.';


-- Student-level occurrences:
-- A single submission can involve one or many students.
create table if not exists public.student_occurrences (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  classroom_id uuid not null references public.classrooms (id) on delete cascade,

  prompt text not null,
  ai_result jsonb, -- stores the AI-generated response (plan, summary, etc.)

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.student_occurrences is
  'Past occurrences for specific students (behavior incidents, planning prompts, etc.).';


-- Join table so one occurrence can be linked to multiple students
create table if not exists public.student_occurrence_students (
  student_occurrence_id uuid not null references public.student_occurrences (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  primary key (student_occurrence_id, student_id)
);

comment on table public.student_occurrence_students is
  'Many-to-many bridge between student_occurrences and students.';


-- Class-level occurrences:
-- For prompts that apply to an entire class instead of specific students.
create table if not exists public.class_occurrences (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  classroom_id uuid not null references public.classrooms (id) on delete cascade,

  prompt text not null,
  ai_result jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.class_occurrences is
  'Class-wide occurrences (prompts and AI results that target the whole classroom).';


----------------------------
-- Basic grants for authenticated clients
----------------------------

grant usage on schema public to authenticated;

grant
  select, insert, update, delete
on public.classrooms,
   public.students,
   public.student_occurrences,
   public.student_occurrence_students,
   public.class_occurrences
to authenticated;


----------------------------
-- Row Level Security (RLS)
----------------------------

-- Classrooms: teachers only see & manage their rooms
alter table public.classrooms enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'classrooms'
      and policyname = 'classrooms_select_own'
  ) then
    create policy classrooms_select_own
      on public.classrooms
      for select
      using (teacher_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'classrooms'
      and policyname = 'classrooms_modify_own'
  ) then
    create policy classrooms_modify_own
      on public.classrooms
      for all
      using (teacher_id = auth.uid())
      with check (teacher_id = auth.uid());
  end if;
end
$$;


-- Students: scoped by teacher
alter table public.students enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'students'
      and policyname = 'students_select_own'
  ) then
    create policy students_select_own
      on public.students
      for select
      using (teacher_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'students'
      and policyname = 'students_modify_own'
  ) then
    create policy students_modify_own
      on public.students
      for all
      using (teacher_id = auth.uid())
      with check (teacher_id = auth.uid());
  end if;
end
$$;


-- Student occurrences: scoped by teacher
alter table public.student_occurrences enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'student_occurrences'
      and policyname = 'student_occurrences_select_own'
  ) then
    create policy student_occurrences_select_own
      on public.student_occurrences
      for select
      using (teacher_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'student_occurrences'
      and policyname = 'student_occurrences_modify_own'
  ) then
    create policy student_occurrences_modify_own
      on public.student_occurrences
      for all
      using (teacher_id = auth.uid())
      with check (teacher_id = auth.uid());
  end if;
end
$$;


-- Join table for student occurrences: enforce via parent occurrence ownership
alter table public.student_occurrence_students enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'student_occurrence_students'
      and policyname = 'student_occurrence_students_select'
  ) then
    create policy student_occurrence_students_select
      on public.student_occurrence_students
      for select
      using (
        exists (
          select 1
          from public.student_occurrences o
          where o.id = student_occurrence_id
            and o.teacher_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'student_occurrence_students'
      and policyname = 'student_occurrence_students_modify'
  ) then
    create policy student_occurrence_students_modify
      on public.student_occurrence_students
      for all
      using (
        exists (
          select 1
          from public.student_occurrences o
          where o.id = student_occurrence_id
            and o.teacher_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1
          from public.student_occurrences o
          where o.id = student_occurrence_id
            and o.teacher_id = auth.uid()
        )
      );
  end if;
end
$$;


-- Class occurrences: scoped by teacher via teacher_id
alter table public.class_occurrences enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'class_occurrences'
      and policyname = 'class_occurrences_select_own'
  ) then
    create policy class_occurrences_select_own
      on public.class_occurrences
      for select
      using (teacher_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'class_occurrences'
      and policyname = 'class_occurrences_modify_own'
  ) then
    create policy class_occurrences_modify_own
      on public.class_occurrences
      for all
      using (teacher_id = auth.uid())
      with check (teacher_id = auth.uid());
  end if;
end
$$;


----------------------------
-- RPC Helpers
----------------------------

-- Create a student-level occurrence for one or many students.
-- This function:
--  - Inserts a row into student_occurrences
--  - Links it to all provided student_ids
--  - Relies on RLS + teacher_id to ensure isolation per teacher
create or replace function public.create_student_occurrence (
  p_classroom_id uuid,
  p_student_ids uuid[],
  p_prompt text,
  p_ai_result jsonb
)
returns public.student_occurrences
language plpgsql
security invoker
as $$
declare
  new_occ public.student_occurrences;
begin
  -- Insert the main occurrence row, tied to the current teacher
  insert into public.student_occurrences (teacher_id, classroom_id, prompt, ai_result)
  values (auth.uid(), p_classroom_id, p_prompt, p_ai_result)
  returning * into new_occ;

  -- Link all the students to this occurrence
  insert into public.student_occurrence_students (student_occurrence_id, student_id)
  select new_occ.id, unnest(p_student_ids);

  return new_occ;
end;
$$;

comment on function public.create_student_occurrence(uuid, uuid[], text, jsonb) is
  'Create a student-level occurrence and link it to one or more students.';


-- Create a class-level occurrence (no per-student links).
create or replace function public.create_class_occurrence (
  p_classroom_id uuid,
  p_prompt text,
  p_ai_result jsonb
)
returns public.class_occurrences
language plpgsql
security invoker
as $$
declare
  new_occ public.class_occurrences;
begin
  insert into public.class_occurrences (teacher_id, classroom_id, prompt, ai_result)
  values (auth.uid(), p_classroom_id, p_prompt, p_ai_result)
  returning * into new_occ;

  return new_occ;
end;
$$;

comment on function public.create_class_occurrence(uuid, text, jsonb) is
  'Create a class-level occurrence linked to a classroom, owned by the current teacher.';


grant execute on function public.create_student_occurrence(uuid, uuid[], text, jsonb) to authenticated;
grant execute on function public.create_class_occurrence(uuid, text, jsonb) to authenticated;


----------------------------
-- Simple “first login” helper view
----------------------------

-- Convenience view: all students for the current teacher.
-- Frontend / agents can:
--   select * from teacher_students
-- If no rows are returned, treat as "first login" and prompt to create students.
create or replace view public.teacher_students as
select *
from public.students
where teacher_id = auth.uid();

grant select on public.teacher_students to authenticated;


