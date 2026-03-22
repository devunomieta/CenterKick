import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkTables() {
  const { data, error } = await supabase.from('coaches').select('id').limit(1);
  if (error) {
    console.log('Error fetching from coaches:', error.message);
  } else {
    console.log('Successfully fetched from coaches');
  }

  const { data: data2, error: error2 } = await supabase.from('profiles').select('id').limit(1);
  if (error2) {
    console.log('Error fetching from profiles:', error2.message);
  } else {
    console.log('Successfully fetched from profiles');
  }
}

checkTables();
