-- ZENAB Database Schema for Supabase (PostgreSQL)

-- 1. Create Stations table
CREATE TABLE IF NOT EXISTS stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  lat FLOAT8 NOT NULL,
  lng FLOAT8 NOT NULL,
  aqi INTEGER NOT NULL,
  pm25 INTEGER,
  pm10 INTEGER,
  o3 INTEGER,
  no2 INTEGER,
  so2 INTEGER,
  co FLOAT4,
  status TEXT NOT NULL,
  trend JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Measurements table (AI/Hardware data)
CREATE TABLE IF NOT EXISTS measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pm25 FLOAT4 NOT NULL,
  pm10 FLOAT4 NOT NULL,
  aqi INTEGER NOT NULL,
  status TEXT NOT NULL,
  confidence FLOAT4,
  detections INTEGER,
  image_file TEXT,
  simulated BOOLEAN DEFAULT false,
  zenab_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Health Assessments table
CREATE TABLE IF NOT EXISTS health_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  age INTEGER NOT NULL,
  conditions TEXT[] DEFAULT '{}',
  activity_level TEXT NOT NULL,
  current_aqi INTEGER,
  risk_level TEXT,
  recommendation TEXT,
  tips TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE stations;
ALTER PUBLICATION supabase_realtime ADD TABLE measurements;
