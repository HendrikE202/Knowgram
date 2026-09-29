-- Knowgram: Sync ohne Konto. Bereits im Supabase-Projekt angewendet (Migration „kg_sync_state“); diese Datei dokumentiert den Stand.
-- Der Sync-Code ist das Geheimnis; gespeichert wird nur sein SHA-256-Hash.
create table if not exists public.kg_state (
  id text primary key check (length(id) = 64),          -- sha256(code) als Hex
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
-- RLS an, bewusst KEINE Policies: direkter Tabellenzugriff über die öffentliche API ist gesperrt.
alter table public.kg_state enable row level security;
revoke all on public.kg_state from anon, authenticated;

-- kg_get(code) -> {state, updated_at} | null
-- kg_put(code, new_state) -> Zeitstempel (max. 20 Codes, 2 MB je Datensatz, Code >= 24 Zeichen)
-- kg_summary(code) -> kompakte Zusammenfassung für die Routine (ohne „gesehen“-Liste)
-- (Funktionsrümpfe: siehe Migration im Supabase-Projekt; alle SECURITY DEFINER mit search_path = '', Ausführung nur für anon.)
