import { createClient } from "@supabase/supabase-js";

/**
 * PUBLIC_INTERFACE
 * Returns a configured Supabase client for the frontend React app.
 * Uses environment variables for endpoint/key.
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
