import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dvfbkjodpztsbqkqwx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZmJram9kcHp0c2JxcXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0MzU2MDAsImV4cCI6MjAyNjAxMTYwMH0.7UFQF6QknJPe9GT_Ggj4V9BHRy7aYkKtRETYYQQGXwE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
