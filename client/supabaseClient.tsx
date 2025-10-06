import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cxrbfzevzrfyffgalmpw.supabase.co"
const supabasePublicKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cmJmemV2enJmeWZmZ2FsbXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTM0MDgsImV4cCI6MjA3MDcyOTQwOH0.NFpBWIetbvbDyZj7zBZH3-5IcRh_yACudgvwdDvtSfc"

export const supabase = createClient(supabaseUrl, supabasePublicKey)