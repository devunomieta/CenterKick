'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Calendar, 
  BarChart3, 
  Plus, 
  Trash2, 
  Settings, 
  Save, 
  X, 
  Edit2, 
  CheckCircle2, 
  ChevronRight,
  MoreVertical,
  Flag,
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';
import { updateTournament, addTeam, removeTeam, addFixture, updateFixture, deleteFixture } from '../actions';

interface TournamentTabsProps {
  tournament: any;
  teams: any[];
  fixtures: any[];
  matchEvents: any[];
}

export function TournamentTabs({ tournament, teams, fixtures, matchEvents }: TournamentTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [isAddingFixture, setIsAddingFixture] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'fixtures', label: 'Fixtures & Results', icon: Calendar },
    { id: 'standings', label: 'Standings', icon: BarChart3 },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-[24px] border border-gray-100 w-fit shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2.5 px-6 py-3.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all duration-300
                ${isActive 
                  ? 'bg-gray-900 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#b50a0a]' : ''}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <OverviewTab tournament={tournament} />
          )}
          {activeTab === 'teams' && (
            <TeamsTab tournament={tournament} teams={teams} isAdding={isAddingTeam} setIsAdding={setIsAddingTeam} />
          )}
          {activeTab === 'fixtures' && (
            <FixturesTab tournament={tournament} fixtures={fixtures} teams={teams} isAdding={isAddingFixture} setIsAdding={setIsAddingFixture} />
          )}
          {activeTab === 'standings' && (
            <StandingsTab teams={teams} type={tournament.type} />
          )}
          {activeTab === 'stats' && (
            <StatisticsTab matchEvents={matchEvents} fixtures={fixtures} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StatisticsTab({ matchEvents, fixtures }: { matchEvents: any[], fixtures: any[] }) {
  const finishedFixturesCount = fixtures.filter(f => f.status === 'finished').length;

  const aggregateStats = (type: string) => {
    const stats = matchEvents.filter(e => e.event_type === type).reduce((acc: any, e) => {
      acc[e.player_name] = (acc[e.player_name] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count: count as number }))
      .sort((a, b) => b.count - a.count);
  };

  const goals = aggregateStats('goal');
  const assists = aggregateStats('assist');
  const yellowCards = aggregateStats('yellow_card');
  const redCards = aggregateStats('red_card');
  const saves = aggregateStats('save');
  const cleanSheets = aggregateStats('clean_sheet');
  const shots = aggregateStats('shot');
  const keyPasses = aggregateStats('key_pass');
  const chancesCreated = aggregateStats('chance_created');
  const chancesMissed = aggregateStats('chance_missed');
  const penalties = aggregateStats('penalty');
  const freeKicks = aggregateStats('free_kick');

  // Calculate Goals + Assists
  const combinedStats = [...new Set([...goals.map(g => g.name), ...assists.map(a => a.name)])].map(name => {
    const gCount = goals.find(g => g.name === name)?.count || 0;
    const aCount = assists.find(a => a.name === name)?.count || 0;
    return { name, count: gCount + aCount, goals: gCount, assists: aCount };
  }).sort((a, b) => b.count - a.count);

  const StatCard = ({ title, data, unit = '', color = 'text-gray-900' }: { title: string, data: any[], unit?: string, color?: string }) => (
    <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm space-y-6">
      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h4>
      <div className="space-y-4">
        {data.slice(0, 3).map((item, i) => (
          <div key={item.name} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black ${i === 0 ? 'text-[#b50a0a]' : 'text-gray-300'}`}>0{i + 1}</span>
              <span className="text-[11px] font-black text-gray-900 uppercase tracking-tight group-hover:text-[#b50a0a] transition-colors">{item.name}</span>
            </div>
            <span className={`text-sm font-black ${color}`}>{item.count}{unit}</span>
          </div>
        ))}
        {data.length === 0 && <p className="text-[10px] font-bold text-gray-300 uppercase italic">No data yet</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Tournament Statistics</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">In-depth performance analysis of the tournament</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Games Analyzed</p>
            <p className="text-xl font-black text-gray-900">{finishedFixturesCount}</p>
          </div>
          <div className="w-px h-10 bg-gray-100"></div>
          <div className="text-right">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Events</p>
            <p className="text-xl font-black text-[#b50a0a]">{matchEvents.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Top Goal Scorers" data={goals} />
        <StatCard title="Assist Kings" data={assists} />
        <StatCard title="Goals + Assists" data={combinedStats} />
        <StatCard title="Clean Sheets" data={cleanSheets} color="text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <div className="lg:col-span-2 bg-gray-900 rounded-[40px] p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#b50a0a] blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 space-y-8">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gameplay Efficiency</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-500 uppercase">Shots PG</p>
                <p className="text-3xl font-black">{(shots.reduce((a, b) => a + b.count, 0) / (finishedFixturesCount || 1)).toFixed(1)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-500 uppercase">Key Passes PG</p>
                <p className="text-3xl font-black">{(keyPasses.reduce((a, b) => a + b.count, 0) / (finishedFixturesCount || 1)).toFixed(1)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-500 uppercase">Saves PG</p>
                <p className="text-3xl font-black text-green-500">{(saves.reduce((a, b) => a + b.count, 0) / (finishedFixturesCount || 1)).toFixed(1)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-500 uppercase">Conversion Rate</p>
                <p className="text-3xl font-black text-[#b50a0a]">
                  {Math.round((goals.reduce((a, b) => a + b.count, 0) / (shots.reduce((a, b) => a + b.count, 0) || 1)) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-sm space-y-8">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discipline Record</h4>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-yellow-50 rounded-3xl border border-yellow-100">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-yellow-800 uppercase">Total Yellow Cards</p>
                <p className="text-2xl font-black text-yellow-900">{yellowCards.reduce((a, b) => a + b.count, 0)}</p>
              </div>
              <div className="w-8 h-12 bg-yellow-400 rounded-lg shadow-sm"></div>
            </div>
            <div className="flex items-center justify-between p-6 bg-red-50 rounded-3xl border border-red-100">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-red-800 uppercase">Total Red Cards</p>
                <p className="text-2xl font-black text-red-900">{redCards.reduce((a, b) => a + b.count, 0)}</p>
              </div>
              <div className="w-8 h-12 bg-red-600 rounded-lg shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Chances Created" data={chancesCreated} />
        <StatCard title="Chances Missed" data={chancesMissed} color="text-red-500" />
        <StatCard title="Penalty Goals" data={penalties} />
        <StatCard title="Free Kick Goals" data={freeKicks} />
      </div>
    </div>
  );
}

function OverviewTab({ tournament }: { tournament: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white border border-gray-100 rounded-[40px] p-10 space-y-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Basic Information</h3>
            <button className="flex items-center gap-2 text-[10px] font-black text-[#b50a0a] uppercase tracking-widest hover:opacity-70 transition-opacity">
              <Edit2 className="w-3 h-3" /> Edit Details
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Tournament Name</label>
              <p className="text-lg font-black text-gray-900 uppercase">{tournament.name}</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Format</label>
              <p className="text-lg font-black text-gray-900 uppercase">{tournament.type}</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Start Date</label>
              <p className="text-lg font-black text-gray-900 uppercase">
                {tournament.start_date ? format(new Date(tournament.start_date), 'MMMM dd, yyyy') : 'Not Set'}
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">End Date</label>
              <p className="text-lg font-black text-gray-900 uppercase">
                {tournament.end_date ? format(new Date(tournament.end_date), 'MMMM dd, yyyy') : 'Not Set'}
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pt-4 border-t border-gray-50">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Description</label>
            <p className="text-gray-500 font-bold text-xs leading-relaxed max-w-2xl">
              {tournament.description || 'No description provided for this tournament.'}
            </p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-[40px] p-10 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#b50a0a] blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                <Flag className="w-5 h-5 text-[#b50a0a]" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">Public Visibility</h3>
            </div>
            <p className="text-gray-400 text-xs font-bold leading-relaxed max-w-md uppercase tracking-wide">
              Control whether this tournament is visible to the public. Private leagues are only accessible via special links or invitations.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <button className="bg-[#b50a0a] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-gray-900 transition-all">
                Make Private
              </button>
              <button className="bg-white/5 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all border border-white/10">
                Generate Access Key
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white border border-gray-100 rounded-[40px] p-8 space-y-6 shadow-sm">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quick Stats</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-[9px] font-black text-gray-500 uppercase">Teams</span>
              <span className="text-lg font-black text-gray-900">{tournament.teams?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-[9px] font-black text-gray-500 uppercase">Matches</span>
              <span className="text-lg font-black text-gray-900">{tournament.fixtures?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-[9px] font-black text-gray-500 uppercase">Completed</span>
              <span className="text-lg font-black text-green-600">
                {tournament.fixtures?.filter((f: any) => f.status === 'finished').length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamsTab({ tournament, teams, isAdding, setIsAdding }: { tournament: any, teams: any[], isAdding: boolean, setIsAdding: (v: boolean) => void }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Participating Teams</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Manage the elite squads in this tournament</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#b50a0a] transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-3.5 h-3.5" /> Add Team
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] p-10 flex flex-col items-center gap-6"
        >
          <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center shadow-sm">
            <Users className="w-8 h-8 text-[#b50a0a]" />
          </div>
          <div className="text-center space-y-2">
            <h4 className="text-lg font-black text-gray-900 uppercase">Add New Team</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-[200px]">Enter the team name to register them</p>
          </div>
          <form action={async (formData) => {
            await addTeam(tournament.id, formData);
            setIsAdding(false);
          }} className="flex items-center gap-3 w-full max-w-md">
            <input 
              name="team_name"
              placeholder="E.G. LAGOS RANGERS"
              className="flex-1 bg-white border border-gray-100 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-[#b50a0a] outline-none shadow-sm"
              required
            />
            <button className="bg-[#b50a0a] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-900 transition-all">
              Add
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="p-4 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 transition-all">
              <X className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-white border border-gray-100 rounded-[32px] p-8 flex items-center justify-between group hover:shadow-xl transition-all duration-500">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform duration-500">
                {team.team_logo_url ? (
                  <img src={team.team_logo_url} alt={team.team_name} className="w-10 h-10 object-contain" />
                ) : (
                  <Trophy className="w-6 h-6 text-gray-200" />
                )}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{team.team_name}</h4>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ID: {team.id.slice(0, 8)}</p>
              </div>
            </div>
            <button 
              onClick={async () => {
                if(confirm('Remove this team?')) {
                  await removeTeam(team.id, tournament.id);
                }
              }}
              className="p-3 rounded-xl bg-gray-50 text-gray-300 hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FixturesTab({ tournament, fixtures, teams, isAdding, setIsAdding }: { tournament: any, fixtures: any[], teams: any[], isAdding: boolean, setIsAdding: (v: boolean) => void }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Fixtures & Results</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scheduled matches and historical results</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#b50a0a] transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-3.5 h-3.5" /> Create Fixture
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-xl"
        >
          <div className="flex items-center justify-between mb-10">
            <h4 className="text-xl font-black text-gray-900 uppercase">Create New Fixture</h4>
            <button onClick={() => setIsAdding(false)} className="p-3 rounded-xl hover:bg-gray-50 transition-all">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <form action={async (formData) => {
            await addFixture(tournament.id, formData);
            setIsAdding(false);
          }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Home Team</label>
              <select name="home_team_id" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#b50a0a]" required>
                <option value="">Select Team</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Away Team</label>
              <select name="away_team_id" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#b50a0a]" required>
                <option value="">Select Team</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Match Date & Time</label>
              <input type="datetime-local" name="match_date" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#b50a0a]" required />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Venue</label>
              <input name="venue" placeholder="E.G. NATIONAL STADIUM" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#b50a0a]" />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Round / Week</label>
              <input name="round" placeholder="E.G. WEEK 1" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#b50a0a]" />
            </div>
            <div className="md:col-span-2 pt-6">
              <button className="w-full bg-gray-900 text-white py-5 rounded-[20px] font-black uppercase tracking-widest text-[10px] hover:bg-[#b50a0a] transition-all shadow-xl">
                Schedule Match
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {fixtures.map((fixture) => (
          <div key={fixture.id} className="bg-white border border-gray-100 rounded-[32px] overflow-hidden group hover:shadow-lg transition-all duration-500">
            <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
              {/* Date & Info */}
              <div className="flex items-center gap-6 min-w-[200px]">
                <div className="flex flex-col items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-[#b50a0a] group-hover:border-[#b50a0a] transition-colors duration-500">
                  <span className="text-[8px] font-black text-gray-400 uppercase group-hover:text-white/60 transition-colors">
                    {format(new Date(fixture.match_date), 'MMM')}
                  </span>
                  <span className="text-xl font-black text-gray-900 group-hover:text-white transition-colors">
                    {format(new Date(fixture.match_date), 'dd')}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-[#b50a0a] uppercase tracking-widest">{fixture.round || 'Regular'}</span>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">{fixture.venue || 'TBA'}</span>
                  </div>
                </div>
              </div>

              {/* Match Scoreline */}
              <div className="flex-1 flex items-center justify-center gap-12">
                <div className="flex-1 flex items-center justify-end gap-6">
                  <span className="text-sm font-black text-gray-900 uppercase tracking-tight text-right">{fixture.home_team?.team_name}</span>
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                    <Trophy className="w-6 h-6 text-gray-200" />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-4">
                    {fixture.status === 'finished' ? (
                      <div className="flex items-center gap-4 bg-gray-900 px-6 py-3 rounded-2xl text-white shadow-lg">
                        <span className="text-2xl font-black">{fixture.home_score}</span>
                        <span className="text-gray-600 font-black text-sm">-</span>
                        <span className="text-2xl font-black">{fixture.away_score}</span>
                      </div>
                    ) : (
                      <form action={async (formData) => {
                        const home_score = parseInt(formData.get('home_score') as string);
                        const away_score = parseInt(formData.get('away_score') as string);
                        await updateFixture(fixture.id, tournament.id, { 
                          home_score, 
                          away_score, 
                          status: 'finished' 
                        });
                      }} className="flex items-center gap-2">
                        <input name="home_score" type="number" defaultValue="0" min="0" className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl text-center font-black outline-none focus:ring-2 focus:ring-[#b50a0a]" />
                        <span className="font-black text-gray-300">-</span>
                        <input name="away_score" type="number" defaultValue="0" min="0" className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl text-center font-black outline-none focus:ring-2 focus:ring-[#b50a0a]" />
                        <button className="p-3 bg-gray-900 text-white rounded-xl hover:bg-[#b50a0a] transition-all ml-2">
                          <Save className="w-4 h-4" />
                        </button>
                      </form>
                    )}
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${fixture.status === 'finished' ? 'text-green-600' : 'text-[#b50a0a]'}`}>
                    {fixture.status}
                  </span>
                </div>

                <div className="flex-1 flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                    <Trophy className="w-6 h-6 text-gray-200" />
                  </div>
                  <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{fixture.away_team?.team_name}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="p-4 rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={async () => {
                    if(confirm('Delete this fixture?')) await deleteFixture(fixture.id, tournament.id);
                  }}
                  className="p-4 rounded-2xl bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {fixtures.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
            <Calendar className="w-10 h-10 text-gray-200" />
            <div className="space-y-1">
              <h4 className="text-lg font-black text-gray-900 uppercase">No Fixtures Scheduled</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Start by creating the first match of the tournament</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StandingsTab({ teams, type }: { teams: any[], type: string }) {
  // Sort teams by points, then goal difference, then goals for
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const gdA = a.goals_for - a.goals_against;
    const gdB = b.goals_for - b.goals_against;
    if (gdB !== gdA) return gdB - gdA;
    return b.goals_for - a.goals_for;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">League Standings</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Real-time table based on match results</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-100 px-6 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-all shadow-sm">
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">#</th>
                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Team</th>
                <th className="px-6 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">P</th>
                <th className="px-6 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">W</th>
                <th className="px-6 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">D</th>
                <th className="px-6 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">L</th>
                <th className="px-6 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">GF</th>
                <th className="px-6 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">GA</th>
                <th className="px-6 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">GD</th>
                <th className="px-8 py-6 text-[9px] font-black text-gray-900 uppercase tracking-widest text-center">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedTeams.map((team, index) => (
                <tr key={team.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <span className={`text-xs font-black ${index < 3 ? 'text-[#b50a0a]' : 'text-gray-400'}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                        {team.team_logo_url ? (
                          <img src={team.team_logo_url} alt={team.team_name} className="w-7 h-7 object-contain" />
                        ) : (
                          <Trophy className="w-5 h-5 text-gray-200" />
                        )}
                      </div>
                      <span className="text-[11px] font-black text-gray-900 uppercase tracking-tight">{team.team_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-[11px] font-bold text-gray-500 text-center">{team.played}</td>
                  <td className="px-6 py-6 text-[11px] font-bold text-gray-500 text-center">{team.won}</td>
                  <td className="px-6 py-6 text-[11px] font-bold text-gray-500 text-center">{team.drawn}</td>
                  <td className="px-6 py-6 text-[11px] font-bold text-gray-500 text-center">{team.lost}</td>
                  <td className="px-6 py-6 text-[11px] font-bold text-gray-500 text-center">{team.goals_for}</td>
                  <td className="px-6 py-6 text-[11px] font-bold text-gray-500 text-center">{team.goals_against}</td>
                  <td className="px-6 py-6 text-[11px] font-bold text-gray-500 text-center">
                    {team.goals_for - team.goals_against}
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-gray-900 text-center">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
