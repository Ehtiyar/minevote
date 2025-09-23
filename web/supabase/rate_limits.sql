-- Rate limiting tablosu oluşturma
CREATE TABLE IF NOT EXISTS rate_limits (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  count INTEGER DEFAULT 1,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler oluşturma
CREATE INDEX IF NOT EXISTS idx_rate_limits_key ON rate_limits(key);
CREATE INDEX IF NOT EXISTS idx_rate_limits_expires ON rate_limits(expires_at);

-- Süresi dolmuş kayıtları temizlemek için fonksiyon
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Her 5 dakikada bir süresi dolmuş kayıtları temizlemek için cron job
-- (Supabase'de pg_cron extension'ı aktifse)
-- SELECT cron.schedule('cleanup-rate-limits', '*/5 * * * *', 'SELECT cleanup_expired_rate_limits();');

-- RLS (Row Level Security) politikaları
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Service role için tam erişim
CREATE POLICY "Service role can do everything" ON rate_limits
  FOR ALL USING (auth.role() = 'service_role');

-- Anon kullanıcılar için sadece okuma
CREATE POLICY "Anon users can read" ON rate_limits
  FOR SELECT USING (auth.role() = 'anon');
