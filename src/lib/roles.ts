/**
 * Single source of truth for the account-type ("role") list.
 * Anywhere the app enumerates all account types (register dropdown, nav,
 * admin filters, pricing gates, public-profile route builder) should read
 * from ROLES instead of hardcoding the list, so adding a future role only
 * requires editing this file.
 */

export type RoleId = 'player' | 'coach' | 'agent' | 'scout' | 'organization' | 'professional';

export interface RoleConfig {
  id: RoleId;
  label: string;
  /** Segment used in public profile URLs, e.g. /coaches/[slug] */
  publicRouteSegment: string;
  order: number;
}

export const ROLES: RoleConfig[] = [
  { id: 'player', label: 'Player', publicRouteSegment: 'players', order: 1 },
  { id: 'coach', label: 'Coach', publicRouteSegment: 'coaches', order: 2 },
  { id: 'agent', label: 'Agent', publicRouteSegment: 'agents', order: 3 },
  { id: 'scout', label: 'Scout', publicRouteSegment: 'scouts', order: 4 },
  { id: 'organization', label: 'Organization', publicRouteSegment: 'organizations', order: 5 },
  { id: 'professional', label: 'Professional', publicRouteSegment: 'professionals', order: 6 },
];

export function getRoleConfig(role?: string | null): RoleConfig | undefined {
  const normalized = (role || '').toLowerCase();
  return ROLES.find((r) => r.id === normalized);
}

/** Builds the canonical public profile URL for a given role + slug/id. */
export function getPublicProfileRoute(role: string | null | undefined, slugOrId: string): string {
  const config = getRoleConfig(role);
  return `/${config?.publicRouteSegment || 'players'}/${slugOrId}`;
}

/**
 * Curated list of non-player/coach/scout/agent/organization sports-industry
 * professions, grouped for the profile-type sub-picker. Selecting "Other"
 * reveals a free-text field (profession_category_other) so the list never
 * limits who can create a Professional profile.
 */
export const PROFESSIONAL_CATEGORY_OTHER = 'Other';

export const PROFESSIONAL_CATEGORY_GROUPS: { group: string; options: string[] }[] = [
  {
    group: 'Medical & Fitness',
    options: [
      'Sports Medicine Doctor',
      'Team Doctor',
      'Physiotherapist / Physical Therapist',
      'Sports Therapist',
      'Sports Scientist',
      'Fitness & Conditioning Coach',
      'Strength & Conditioning Coach',
      'Rehabilitation Specialist',
      'Nutritionist / Dietitian',
      'Psychologist / Mental Performance Coach',
    ],
  },
  {
    group: 'Coaching Support',
    options: ['Goalkeeping Coach'],
  },
  {
    group: 'Analysis & Data',
    options: [
      'Sports Analyst / Performance Analyst',
      'Data Analyst',
      'Video Analyst',
      'Talent Identification Specialist',
    ],
  },
  {
    group: 'Administration & Management',
    options: [
      'Team Manager',
      'Club Administrator',
      'Football Operations Manager',
      'Kit Manager / Equipment Manager',
      'Academy Coordinator',
      'Football Development Officer',
      'Safeguarding Officer',
      'Competition/Tournament Coordinator',
      'Scout Coordinator',
    ],
  },
  {
    group: 'Media & Communications',
    options: [
      'Sports Photographer',
      'Sports Journalist',
      'Commentator',
      'Presenter',
      'Media Officer',
      'Communications Officer',
    ],
  },
  {
    group: 'Officiating',
    options: ['Referee', 'Referee Assessor', 'Match Commissioner'],
  },
  {
    group: 'Facilities',
    options: ['Groundskeeper / Pitch Manager'],
  },
];

export const PROFESSIONAL_CATEGORY_OPTIONS: string[] = PROFESSIONAL_CATEGORY_GROUPS.flatMap((g) => g.options);
