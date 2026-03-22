import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAgents() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, role, email')
    .ilike('role', '%agent%');

  if (error) {
    console.error("Error fetching agents:", error);
  } else {
    console.log("Agents found:", JSON.stringify(data, null, 2));
  }
}

checkAgents();
