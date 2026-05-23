const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xmclutbbcfcwbklemdae.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtY2x1dGJiY2Zjd2JrbGVtZGFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU4NDk0OCwiZXhwIjoyMDg5MTYwOTQ4fQ.h5stkSpk4SvcDAmNpZEkkVwBbMcdKFA4dMZJYLi-yVs';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

async function findAdmin() {
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, role');

  if (usersError) {
    console.error('Error fetching users:', usersError);
    return;
  }

  console.log('Public Users list:');
  console.log(users);

  // Now get details from auth.users
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error('Error fetching auth users:', authError);
    return;
  }

  console.log('Auth Users:');
  authUsers.users.forEach(u => {
    const pubUser = users.find(pu => pu.id === u.id);
    console.log(`Email: ${u.email}, ID: ${u.id}, Role: ${pubUser ? pubUser.role : 'none'}`);
  });
}

findAdmin();
