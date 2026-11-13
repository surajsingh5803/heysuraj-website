CREATE TABLE IF NOT EXISTS pico_messages (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name VARCHAR(80) NOT NULL DEFAULT '',
  contact VARCHAR(120) NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  visitor_role VARCHAR(30) NOT NULL DEFAULT 'visitor',
  source_page VARCHAR(180) NOT NULL DEFAULT '/',
  consent_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'new',
  emailed BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS pico_messages_created_idx ON pico_messages (created_at DESC);
