-- ===== SHAKING DANCE — TABLAS SUPABASE =====

-- CURSOS
create table if not exists cursos (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  estilo text not null,
  nivel text default 'Básico',
  descripcion text,
  color text default '#1D9E75',
  icono text default 'ti-music',
  created_at timestamp default now()
);

-- LECCIONES
create table if not exists lecciones (
  id uuid default gen_random_uuid() primary key,
  curso_id uuid references cursos(id) on delete cascade,
  titulo text not null,
  duracion text not null,
  descripcion text,
  youtube_url text,
  numero int not null default 1,
  publicado boolean default false,
  created_at timestamp default now()
);

-- ALUMNOS
create table if not exists alumnos (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  email text unique not null,
  telefono text,
  plan text default 'Plan Básico',
  status text default 'activo',
  fecha_vencimiento text,
  created_at timestamp default now()
);

-- PROGRESO DE ALUMNOS
create table if not exists progreso (
  id uuid default gen_random_uuid() primary key,
  alumno_id uuid references alumnos(id) on delete cascade,
  leccion_id uuid references lecciones(id) on delete cascade,
  completado boolean default false,
  fecha_completado timestamp,
  unique(alumno_id, leccion_id)
);

-- DATOS INICIALES — CURSOS
insert into cursos (nombre, estilo, nivel, color, icono) values
  ('Salsa', 'salsa', 'Básico', '#1D9E75', 'ti-music'),
  ('Bachata', 'bachata', 'Básico', '#7F77DD', 'ti-heart'),
  ('Hip Hop', 'hiphop', 'Básico', '#1D9E75', 'ti-trending-up'),
  ('Reggaeton', 'reggaeton', 'Básico', '#EF9F27', 'ti-flame'),
  ('Cumbia', 'cumbia', 'Básico', '#378ADD', 'ti-music')
on conflict do nothing;

-- HABILITAR RLS (Row Level Security) — acceso público por ahora
alter table cursos enable row level security;
alter table lecciones enable row level security;
alter table alumnos enable row level security;
alter table progreso enable row level security;

-- POLÍTICAS — permitir todo con la anon key por ahora
create policy "allow all cursos" on cursos for all using (true) with check (true);
create policy "allow all lecciones" on lecciones for all using (true) with check (true);
create policy "allow all alumnos" on alumnos for all using (true) with check (true);
create policy "allow all progreso" on progreso for all using (true) with check (true);
