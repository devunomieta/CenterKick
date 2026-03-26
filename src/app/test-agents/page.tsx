import { createClient } from '@/lib/supabase/server';

export default async function TestAgentsPage() {
  const supabase = await createClient();
  
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, role, status, is_subscribed, user_id, agent_id');

  const { data: allUsers } = await supabase
    .from('users')
    .select('id, email, role');

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Debug Agents</h1>
      
      <h2 className="text-xl font-bold mt-6 mb-2">Profiles with roll containing 'agent':</h2>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(allProfiles?.filter(p => p.role?.toLowerCase().includes('agent')), null, 2)}
      </pre>

      <h2 className="text-xl font-bold mt-6 mb-2">Profiles with agent_id set:</h2>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(allProfiles?.filter(p => p.agent_id), null, 2)}
      </pre>

      <h2 className="text-xl font-bold mt-6 mb-2">Users with roll containing 'agent':</h2>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(allUsers?.filter(u => u.role?.toLowerCase().includes('agent')), null, 2)}
      </pre>

      <h2 className="text-xl font-bold mt-6 mb-2">App Query Results:</h2>
      {(() => {
        // Mocking the query logic
        const agents = allProfiles?.filter(p => p.role?.toLowerCase() === 'agent' || allUsers?.find(u => u.id === p.user_id)?.role?.toLowerCase() === 'agent');
        return (
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(agents, null, 2)}
          </pre>
        );
      })()}
    </div>
  );
}
