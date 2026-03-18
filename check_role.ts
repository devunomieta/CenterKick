
import { createClient } from './src/lib/supabase/server';

async function checkUser() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Current Session User ID:', session?.user.id);
  console.log('Current Session Email:', session?.user.email);

  if (session?.user.id) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    console.log('User Record:', user);
    console.log('Error:', error);
  }
}

checkUser();
