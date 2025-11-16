-- Refresh the teacher_students view so it exposes all current student profile fields
-- (including email, issues, strengths, goals, avatar) to the frontend.
--
-- Why this is needed:
-- - The original view was created before these columns were added to public.students.
-- - In Postgres, a view defined with `select *` is expanded at creation time, so
--   newly added columns are NOT automatically included.
-- - As a result, queries against teacher_students were missing these fields,
--   causing the classroom simulation and analytics UI to see empty arrays / nulls
--   and render placeholder values like "None" and default avatars.
--
-- This migration simply recreates the view using the latest definition of
-- public.students so all columns are available to the frontend.

create or replace view public.teacher_students as
select *
from public.students
where teacher_id = auth.uid();

grant select on public.teacher_students to authenticated;


