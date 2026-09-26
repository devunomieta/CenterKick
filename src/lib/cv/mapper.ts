import { stripHtmlToPlainText } from '@/lib/utils/richText';
import { getPublicProfileRoute } from '@/lib/roles';

export interface CvBlock {
  heading: string;
  subheading?: string;
  meta?: string;
  bullets?: string[];
}

export interface CvSection {
  label: string;
  blocks: CvBlock[];
  emptyText?: string;
}

export interface CvDocument {
  name: string;
  title: string;
  email: string;
  phone: string;
  website?: string;
  socials: { label: string; value: string }[];
  summary: string;
  sections: CvSection[];
  profileUrl: string;
}

function formatMonthYear(value?: string | null): string {
  if (!value) return '';
  const [year, month] = String(value).split(/[-/]/);
  if (!year) return String(value);
  if (!month) return year;
  const date = new Date(Number(year), Number(month) - 1);
  if (isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatSocials(profile: any): { label: string; value: string }[] {
  const links = { ...(profile.social_links || {}), ...(profile.official_links || {}) };
  const socials: { label: string; value: string }[] = [];
  if (links.website) socials.push({ label: 'Website', value: links.website });
  if (links.linkedin) socials.push({ label: 'LinkedIn', value: links.linkedin });
  if (links.twitter) socials.push({ label: 'X / Twitter', value: links.twitter });
  if (links.instagram) socials.push({ label: 'Instagram', value: links.instagram });
  if (links.facebook) socials.push({ label: 'Facebook', value: links.facebook });
  const youtube = profile.youtube_channel_url || links.youtube_channel || links.youtube;
  if (youtube) socials.push({ label: 'YouTube', value: youtube });
  return socials;
}

function achievementsSection(profile: any): CvSection {
  const raw = (profile.achievements && profile.achievements.length > 0) ? profile.achievements : (profile.organization_honors || []);
  const blocks: CvBlock[] = (raw || []).map((item: any) => {
    const isString = typeof item === 'string';
    return {
      heading: isString ? item : (item.title || item.name || 'Achievement'),
      meta: isString ? '' : (item.year || ''),
      subheading: isString ? '' : (item.category || ''),
    };
  });
  return { label: 'Achievements & Awards', blocks, emptyText: 'No achievements recorded.' };
}

function playerSections(profile: any): CvSection[] {
  const careerBlocks: CvBlock[] = (profile.career_stats || []).map((s: any) => ({
    heading: s.club_name || s.club || 'Club',
    subheading: s.league_name || s.league || '',
    meta: s.season || '',
    bullets: [
      `Appearances: ${s.appearances || s.apps || 0} · Goals: ${s.goals || 0} · Assists: ${s.assists || 0}`,
    ],
  }));
  const transferBlocks: CvBlock[] = (profile.transfer_history || []).map((t: any) => ({
    heading: t.to_club || 'Unknown',
    subheading: `Transferred from ${t.from_club || t.club || 'Unknown'}`,
    meta: t.date || '',
  }));
  return [
    { label: 'Career Statistics', blocks: careerBlocks, emptyText: 'No career statistics recorded.' },
    { label: 'Transfer History', blocks: transferBlocks, emptyText: 'No transfer history recorded.' },
    achievementsSection(profile),
  ];
}

function coachSections(profile: any): CvSection[] {
  const history: CvBlock[] = (profile.managerial_history || []).map((r: any) => ({
    heading: r.club || 'Club',
    subheading: r.role || '',
    meta: `${r.startDate || '?'} - ${r.endDate || 'Present'}`,
    bullets: [`Record: ${r.wins || 0}W / ${r.draws || 0}D / ${r.losses || 0}L`],
  }));
  const detailsBullets: string[] = [];
  if (profile.coaching_licenses?.length) detailsBullets.push(`Licenses: ${profile.coaching_licenses.join(', ')}`);
  if (profile.specializations?.length) detailsBullets.push(`Specializations: ${profile.specializations.join(', ')}`);
  if (profile.languages_spoken?.length) detailsBullets.push(`Languages: ${profile.languages_spoken.join(', ')}`);
  if (profile.formation) detailsBullets.push(`Preferred Formation: ${profile.formation}`);
  return [
    { label: 'Managerial History', blocks: history, emptyText: 'No managerial history recorded.' },
    { label: 'Coaching Profile', blocks: detailsBullets.length ? [{ heading: 'Summary', bullets: detailsBullets }] : [], emptyText: 'No coaching profile details recorded.' },
    achievementsSection(profile),
  ];
}

function agentSections(profile: any): CvSection[] {
  const transfers: CvBlock[] = (profile.notable_transfers || []).map((t: any) => ({
    heading: t.playerName || 'Player',
    subheading: `${t.fromClub || ''} → ${t.toClub || ''}`,
    meta: t.date || '',
    bullets: [t.fee ? `Fee: ${t.fee}` : '', t.agentRole ? `Role: ${t.agentRole}` : ''].filter(Boolean),
  }));
  const detailsBullets: string[] = [];
  if (profile.fa_license_number) detailsBullets.push(`FA/FIFA License: ${profile.fa_license_number}`);
  if (profile.agency_role) detailsBullets.push(`Agency Role: ${profile.agency_role}`);
  if (profile.regions_of_operation?.length) detailsBullets.push(`Regions of Operation: ${profile.regions_of_operation.join(', ')}`);
  return [
    { label: 'Notable Transfers', blocks: transfers, emptyText: 'No notable transfers recorded.' },
    { label: 'Agency Profile', blocks: detailsBullets.length ? [{ heading: 'Summary', bullets: detailsBullets }] : [], emptyText: 'No agency profile details recorded.' },
  ];
}

function scoutSections(profile: any): CvSection[] {
  const discoveries: CvBlock[] = (profile.past_discoveries || []).map((d: any) => ({
    heading: typeof d === 'string' ? d : (d.playerName || d.name || 'Discovery'),
    subheading: typeof d === 'string' ? '' : (d.club || ''),
    meta: typeof d === 'string' ? '' : (d.year || ''),
  }));
  const detailsBullets: string[] = [];
  if (profile.fa_license_number) detailsBullets.push(`FA/Accreditation Number: ${profile.fa_license_number}`);
  if (profile.scouting_qualifications?.length) detailsBullets.push(`Qualifications: ${profile.scouting_qualifications.join(', ')}`);
  if (profile.specialized_regions?.length) detailsBullets.push(`Specialized Regions: ${profile.specialized_regions.join(', ')}`);
  if (profile.scouting_methodologies?.length) detailsBullets.push(`Methodologies: ${profile.scouting_methodologies.join(', ')}`);
  return [
    { label: 'Past Discoveries', blocks: discoveries, emptyText: 'No past discoveries recorded.' },
    { label: 'Scouting Profile', blocks: detailsBullets.length ? [{ heading: 'Summary', bullets: detailsBullets }] : [], emptyText: 'No scouting profile details recorded.' },
  ];
}

function organizationSections(profile: any): CvSection[] {
  const personnel: CvBlock[] = (profile.key_personnel || []).map((p: any) => ({
    heading: p.name || 'Personnel',
    subheading: p.role || p.position || '',
  }));
  const detailsBullets: string[] = [];
  if (profile.organization_type) detailsBullets.push(`Organization Type: ${profile.organization_type}`);
  if (profile.year_established) detailsBullets.push(`Year Established: ${profile.year_established}`);
  return [
    { label: 'Organization Profile', blocks: detailsBullets.length ? [{ heading: 'Summary', bullets: detailsBullets }] : [], emptyText: 'No organization profile details recorded.' },
    { label: 'Key Personnel', blocks: personnel, emptyText: 'No key personnel recorded.' },
    achievementsSection(profile),
  ];
}

function professionalSections(profile: any): CvSection[] {
  const experience: CvBlock[] = (profile.work_experience || []).map((r: any) => ({
    heading: r.organization || 'Organization',
    subheading: r.position || '',
    meta: `${formatMonthYear(r.start_date)} - ${r.is_current ? 'Present' : (formatMonthYear(r.end_date) || 'N/A')}`,
    bullets: r.responsibilities || [],
  }));
  const qualifications: CvBlock[] = (profile.qualifications || []).map((q: any) => ({
    heading: q.title || 'Qualification',
    subheading: q.issuing_body || '',
    meta: `${formatMonthYear(q.date_obtained)}${q.expiry_date ? ` – Expires ${formatMonthYear(q.expiry_date)}` : ''}`,
    bullets: q.credential_id ? [`Credential ID: ${q.credential_id}`] : [],
  }));
  return [
    { label: 'Professional Experience', blocks: experience, emptyText: 'No professional experience recorded.' },
    { label: 'Qualifications & Certifications', blocks: qualifications, emptyText: 'No qualifications recorded.' },
    achievementsSection(profile),
  ];
}

const ROLE_SECTION_BUILDERS: Record<string, (profile: any) => CvSection[]> = {
  player: playerSections,
  athlete: playerSections,
  coach: coachSections,
  agent: agentSections,
  scout: scoutSections,
  organization: organizationSections,
  professional: professionalSections,
};

export function buildCvDocument(profile: any, role: string): CvDocument {
  const displayName = profile.full_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'CenterKick Member';
  const title = role === 'professional'
    ? (profile.profession_title || profile.profession_category || 'Sports Professional')
    : role === 'organization'
      ? (profile.organization_type || 'Organization')
      : role.charAt(0).toUpperCase() + role.slice(1);

  const sectionsBuilder = ROLE_SECTION_BUILDERS[role.toLowerCase()] || (() => []);

  return {
    name: displayName,
    title,
    email: profile.contact_email || profile.email || '',
    phone: profile.phone_number || profile.phone || '',
    socials: formatSocials(profile),
    summary: stripHtmlToPlainText(profile.bio),
    sections: sectionsBuilder(profile),
    profileUrl: getPublicProfileRoute(role, profile.slug || profile.id),
  };
}
