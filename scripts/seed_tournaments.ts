import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xmclutbbcfcwbklemdae.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtY2x1dGJiY2Zjd2JrbGVtZGFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU4NDk0OCwiZXhwIjoyMDg5MTYwOTQ4fQ.h5stkSpk4SvcDAmNpZEkkVwBbMcdKFA4dMZJYLi-yVs';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('🚀 Starting seed process...');

  // 1. Clear existing data
  await supabase.from('tournaments').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 2. Lagos Premier League (League)
  console.log('⚽ Seeding Lagos Premier League...');
  const { data: league, error: leagueErr } = await supabase
    .from('tournaments')
    .insert([{
      name: 'Lagos Premier League',
      slug: 'lagos-premier-league',
      type: 'league',
      description: 'The most prestigious local league in Lagos state.',
      is_active: true,
      start_date: '2026-01-10',
      end_date: '2026-12-20'
    }])
    .select()
    .single();

  if (leagueErr) throw leagueErr;

  const leagueTeams = [
    { team_name: 'Ikeja United', points: 12, played: 5, won: 4, drawn: 0, lost: 1, goals_for: 10, goals_against: 3 },
    { team_name: 'Lekki FC', points: 10, played: 5, won: 3, drawn: 1, lost: 1, goals_for: 8, goals_against: 5 },
    { team_name: 'Surulere Warriors', points: 7, played: 5, won: 2, drawn: 1, lost: 2, goals_for: 6, goals_against: 6 },
    { team_name: 'Badagry Blazers', points: 6, played: 5, won: 2, drawn: 0, lost: 3, goals_for: 5, goals_against: 8 },
    { team_name: 'Epe Eagles', points: 4, played: 5, won: 1, drawn: 1, lost: 3, goals_for: 4, goals_against: 9 },
    { team_name: 'Ikorodu Stars', points: 3, played: 5, won: 1, drawn: 0, lost: 4, goals_for: 3, goals_against: 5 }
  ].map(t => ({ ...t, tournament_id: league.id }));

  const { data: insertedLeagueTeams, error: teamsErr } = await supabase
    .from('tournament_teams')
    .insert(leagueTeams)
    .select();

  if (teamsErr) throw teamsErr;

  // 3. Super 4 Cup (Knockout)
  console.log('🏆 Seeding Super 4 Cup...');
  const { data: cup, error: cupErr } = await supabase
    .from('tournaments')
    .insert([{
      name: 'Super 4 Cup',
      slug: 'super-4-cup',
      type: 'knockout',
      description: 'A high-stakes knockout tournament for the top 4 teams.',
      is_active: true,
      start_date: '2026-05-01',
      end_date: '2026-05-15'
    }])
    .select()
    .single();

  if (cupErr) throw cupErr;

  const cupTeams = [
    { team_name: 'Team Alpha' },
    { team_name: 'Team Beta' },
    { team_name: 'Team Gamma' },
    { team_name: 'Team Delta' }
  ].map(t => ({ ...t, tournament_id: cup.id }));

  const { data: insertedCupTeams, error: cupTeamsErr } = await supabase
    .from('tournament_teams')
    .insert(cupTeams)
    .select();

  if (cupTeamsErr) throw cupTeamsErr;

  // 4. National Championship (Hybrid)
  console.log('🌍 Seeding National Championship...');
  const { data: hybrid, error: hybridErr } = await supabase
    .from('tournaments')
    .insert([{
      name: 'National Championship',
      slug: 'national-championship',
      type: 'hybrid',
      description: 'The ultimate competition combining group stages and knockouts.',
      is_active: true,
      start_date: '2026-06-01',
      end_date: '2026-07-30'
    }])
    .select()
    .single();

  if (hybridErr) throw hybridErr;

  const hybridTeams = Array.from({ length: 8 }).map((_, i) => ({
    team_name: `Province ${i + 1}`,
    tournament_id: hybrid.id
  }));

  const { data: insertedHybridTeams, error: hybridTeamsErr } = await supabase
    .from('tournament_teams')
    .insert(hybridTeams)
    .select();

  if (hybridTeamsErr) throw hybridTeamsErr;

  // 5. Fixtures for League
  console.log('📅 Seeding Fixtures...');
  const team1 = insertedLeagueTeams[0].id;
  const team2 = insertedLeagueTeams[1].id;
  const team3 = insertedLeagueTeams[2].id;
  const team4 = insertedLeagueTeams[3].id;

  const fixtures = [
    {
      tournament_id: league.id,
      home_team_id: team1,
      away_team_id: team2,
      match_date: new Date('2026-01-10T16:00:00Z').toISOString(),
      venue: 'Ikeja Stadium',
      status: 'finished',
      home_score: 2,
      away_score: 1,
      round: 'Week 1'
    },
    {
      tournament_id: league.id,
      home_team_id: team3,
      away_team_id: team4,
      match_date: new Date('2026-01-11T16:00:00Z').toISOString(),
      venue: 'Surulere Arena',
      status: 'finished',
      home_score: 0,
      away_score: 0,
      round: 'Week 1'
    },
    {
      tournament_id: league.id,
      home_team_id: team1,
      away_team_id: team3,
      match_date: new Date('2026-04-20T16:00:00Z').toISOString(),
      venue: 'Ikeja Stadium',
      status: 'scheduled',
      round: 'Week 6'
    }
  ];

  const { data: insertedFixtures, error: fixturesErr } = await supabase
    .from('fixtures')
    .insert(fixtures)
    .select();

  if (fixturesErr) throw fixturesErr;

  // 6. Stats (Match Events) for the first fixture
  console.log('📊 Seeding Match Events...');
  const firstFixture = insertedFixtures[0].id;
  const events = [
    { fixture_id: firstFixture, team_id: team1, player_name: 'John Doe', event_type: 'goal', minute: 23 },
    { fixture_id: firstFixture, team_id: team1, player_name: 'John Doe', event_type: 'goal', minute: 45 },
    { fixture_id: firstFixture, team_id: team2, player_name: 'Jane Smith', event_type: 'goal', minute: 78 },
    { fixture_id: firstFixture, team_id: team1, player_name: 'Mike Ross', event_type: 'yellow_card', minute: 12 }
  ];

  const { error: eventsErr } = await supabase
    .from('match_events')
    .insert(events);

  if (eventsErr) throw eventsErr;

  console.log('✅ Seeding completed successfully!');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
