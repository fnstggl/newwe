// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rskcssgjpbshagjocdre.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJza2Nzc2dqcGJzaGFnam9jZHJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzU3ODUsImV4cCI6MjA2NTUxMTc4NX0.dgRp-eXWdIPXsL5R_lCCNfbhjOwM8KpYXixC4sHBf30";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);