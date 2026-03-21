import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupDuplicates() {
  console.log('Fetching all unlinked profiles...');
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, created_at')
    .is('user_id', null)
    .not('email', 'is', null);

  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }

  console.log(`Found ${profiles.length} unlinked profiles.`);

  const emailGroups: Record<string, any[]> = {};
  profiles.forEach(p => {
    if (!emailGroups[p.email]) emailGroups[p.email] = [];
    emailGroups[p.email].push(p);
  });

  const idsToDelete: string[] = [];

  for (const email in emailGroups) {
    const group = emailGroups[email];
    if (group.length > 1) {
      console.log(`Found ${group.length} duplicates for email: ${email}`);
      // Sort by created_at descending
      group.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      // Keep the first one (most recent), track the rest for deletion
      const toDelete = group.slice(1).map(p => p.id);
      idsToDelete.push(...toDelete);
    }
  }

  if (idsToDelete.length === 0) {
    console.log('No duplicates found to delete.');
    return;
  }

  console.log(`Deleting ${idsToDelete.length} duplicate records...`);
  
  // Note: This might fail if RLS is enabled and we don't have a service role key.
  // But we'll try it.
  const { error: deleteError } = await supabase
    .from('profiles')
    .delete()
    .in('id', idsToDelete);

  if (deleteError) {
    console.error('Error deleting duplicates:', deleteError.message);
    console.log('Falling back to individual deletions if batch failed...');
    
    for (const id of idsToDelete) {
        const { error: singleError } = await supabase.from('profiles').delete().eq('id', id);
        if (singleError) console.error(`Failed to delete profile ${id}:`, singleError.message);
        else console.log(`Deleted profile ${id}`);
    }
  } else {
    console.log('Successfully deleted all duplicates.');
  }
}

cleanupDuplicates();
