'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export async function linkManagedAccount(targetProfileId: string, authId: string, role: string) {
  const supabase = createAdminClient();
  const updateField = role === 'organization' ? { organization_id: authId } : { agent_id: authId };

  const { error } = await supabase
    .from('profiles')
    .update(updateField)
    .eq('id', targetProfileId);

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

export async function unlinkManagedAccount(targetProfileId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('profiles')
    .update({ agent_id: null, organization_id: null })
    .eq('id', targetProfileId);

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}
