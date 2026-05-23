const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xmclutbbcfcwbklemdae.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtY2x1dGJiY2Zjd2JrbGVtZGFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU4NDk0OCwiZXhwIjoyMDg5MTYwOTQ4fQ.h5stkSpk4SvcDAmNpZEkkVwBbMcdKFA4dMZJYLi-yVs';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

async function setPassword() {
  const { data, error } = await supabase.auth.admin.updateUserById(
    '7e8c3924-3d00-4c60-971c-496bb757fb55',
    { password: 'password123' }
  );

  if (error) {
    console.error('Error updating password:', error);
  } else {
    console.log('Password updated successfully for centerkickdev@gmail.com');
  }
}

setPassword();
