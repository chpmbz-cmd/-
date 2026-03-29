import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fizjclrieobbvgjgorxt.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_jMwvnq82aqrx0Z0jBbqgDw_RMCD-i7I';

export const supabase = createClient(supabaseUrl, supabaseKey);
