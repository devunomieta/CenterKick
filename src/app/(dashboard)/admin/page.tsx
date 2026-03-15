import { CheckCircle, XCircle, Search } from 'lucide-react';

export default function AdminDashboard() {
  const pendingProfiles = [
    { id: 1, name: 'John Doe', position: 'Striker', submitted: '2 hours ago' },
    { id: 2, name: 'Bamidele Adeniyi', position: 'Midfielder', submitted: '5 hours ago' },
    { id: 3, name: 'Akere Samuel', position: 'Defender', submitted: '1 day ago' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-yellow-500">
          <p className="text-sm font-medium text-gray-500 mb-1">Pending Approvals</p>
          <h3 className="text-3xl font-black text-gray-900">14</h3>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-500 mb-1">Active Profiles</p>
          <h3 className="text-3xl font-black text-gray-900">1,245</h3>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-primary">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Publishers</p>
          <h3 className="text-3xl font-black text-gray-900">42</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Profile Approval Queue</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search profiles..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-700">
              <tr>
                <th className="px-6 py-4">Player Name</th>
                <th className="px-6 py-4">Position</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{profile.name}</td>
                  <td className="px-6 py-4">{profile.position}</td>
                  <td className="px-6 py-4">{profile.submitted}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded font-medium">View</button>
                       <button className="p-2 text-green-600 hover:bg-green-50 rounded" title="Approve">
                         <CheckCircle className="w-5 h-5" />
                       </button>
                       <button className="p-2 text-red-600 hover:bg-red-50 rounded" title="Reject">
                         <XCircle className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
