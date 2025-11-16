
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xbdgawwrhnnvqpoayarw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiZGdhd3dyaG5udnFwb2F5YXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTgzOTksImV4cCI6MjA3ODg5NDM5OX0.mtJctRxv2Mq7cs4rsRiCvMc08cqRhT9NnC-sQTYeKw4';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
