-- Enable Realtime for Messages Table
-- This allows Supabase Realtime to broadcast INSERT/UPDATE/DELETE events

-- Add messages table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Also add threads table for real-time thread updates
ALTER PUBLICATION supabase_realtime ADD TABLE threads;

-- Set replica identity to FULL so Supabase Realtime can broadcast complete row data
ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER TABLE threads REPLICA IDENTITY FULL;
