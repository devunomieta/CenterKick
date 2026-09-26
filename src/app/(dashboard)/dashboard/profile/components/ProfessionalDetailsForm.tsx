'use client';

import { Plus, Trash2, Trophy, Briefcase, GraduationCap, Calendar } from 'lucide-react';

interface ProfessionalDetailsFormProps {
  data: any;
  onChange: (val: any) => void;
  achievements?: any[];
  onAchievementsChange?: (val: any[]) => void;
  disabled?: boolean;
}

const ENTITY_TYPES = ['Club', 'Academy', 'Federation / FA', 'Private Practice', 'Media Organization', 'Other'];

export function ProfessionalDetailsForm({ data, onChange, achievements, onAchievementsChange, disabled }: ProfessionalDetailsFormProps) {
  // Professional Experience
  const addExperience = () => {
    const history = data.work_experience || [];
    onChange({
      ...data,
      work_experience: [...history, { position: '', organization: '', entity_type: 'Club', start_date: '', end_date: '', is_current: false, responsibilities: [] }]
    });
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const history = [...(data.work_experience || [])];
    history[index] = { ...history[index], [field]: value };
    onChange({ ...data, work_experience: history });
  };

  const removeExperience = (index: number) => {
    const history = (data.work_experience || []).filter((_: any, i: number) => i !== index);
    onChange({ ...data, work_experience: history });
  };

  // Qualifications & Certifications
  const addQualification = () => {
    const list = data.qualifications || [];
    onChange({
      ...data,
      qualifications: [...list, { title: '', issuing_body: '', date_obtained: '', credential_id: '', expiry_date: '' }]
    });
  };

  const updateQualification = (index: number, field: string, value: any) => {
    const list = [...(data.qualifications || [])];
    list[index] = { ...list[index], [field]: value };
    onChange({ ...data, qualifications: list });
  };

  const removeQualification = (index: number) => {
    const list = (data.qualifications || []).filter((_: any, i: number) => i !== index);
    onChange({ ...data, qualifications: list });
  };

  // Achievements & Awards (same shape/editor as Coach/Player profiles)
  const addAchievement = () => {
    if (!onAchievementsChange) return;
    const current = achievements || [];
    onAchievementsChange([...current, { title: '', year: '', category: 'Individual' }]);
  };

  const updateAchievement = (index: number, field: string, value: any) => {
    if (!onAchievementsChange) return;
    const current = [...(achievements || [])];
    if (typeof current[index] === 'string') {
      current[index] = { title: current[index], year: '', category: 'Individual' };
    }
    current[index] = { ...current[index], [field]: value };
    onAchievementsChange(current);
  };

  const removeAchievement = (index: number) => {
    if (!onAchievementsChange) return;
    const current = (achievements || []).filter((_: any, i: number) => i !== index);
    onAchievementsChange(current);
  };

  return (
    <div className="space-y-8">
      {/* Professional Experience */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><Briefcase className="w-5 h-5 text-[#b50a0a]" /> Professional Experience</h3>
            <p className="text-sm text-gray-500 mt-1">Clubs, academies, federations, or personalities you've worked with.</p>
          </div>
          {!disabled && (
            <button type="button" onClick={addExperience} className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-bold transition-colors">
              <Plus className="w-4 h-4" /> Add Role
            </button>
          )}
        </div>

        <div className="space-y-4">
          {(data.work_experience || []).map((record: any, index: number) => (
            <div key={index} className="p-5 bg-white border border-gray-200 rounded-2xl relative group shadow-sm hover:shadow-md transition-shadow">
              {!disabled && (
                <button type="button" onClick={() => removeExperience(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors bg-white rounded-lg p-1 z-10 opacity-0 group-hover:opacity-100" title="Remove Role">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Position / Title Held</label>
                  <input type="text" disabled={disabled} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#b50a0a] outline-none disabled:bg-gray-50 disabled:text-gray-500" value={record.position || ''} onChange={(e) => updateExperience(index, 'position', e.target.value)} placeholder="e.g. Head Physiotherapist" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Organization / Club / Personality</label>
                  <input type="text" disabled={disabled} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#b50a0a] outline-none disabled:bg-gray-50 disabled:text-gray-500" value={record.organization || ''} onChange={(e) => updateExperience(index, 'organization', e.target.value)} placeholder="e.g. Manchester United FC" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Entity Type</label>
                  <select disabled={disabled} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#b50a0a] outline-none disabled:bg-gray-50 disabled:text-gray-500" value={record.entity_type || 'Club'} onChange={(e) => updateExperience(index, 'entity_type', e.target.value)}>
                    {ENTITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Start Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      <input type="date" disabled={disabled} className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#b50a0a] outline-none disabled:bg-gray-50 disabled:text-gray-500" value={record.start_date || ''} onChange={(e) => updateExperience(index, 'start_date', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">End Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      <input type="date" disabled={disabled || record.is_current} className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#b50a0a] outline-none disabled:bg-gray-50 disabled:text-gray-500" value={record.is_current ? '' : (record.end_date || '')} onChange={(e) => updateExperience(index, 'end_date', e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 flex items-center gap-2">
                  <input
                    id={`is_current_${index}`}
                    type="checkbox"
                    disabled={disabled}
                    checked={!!record.is_current}
                    onChange={(e) => updateExperience(index, 'is_current', e.target.checked)}
                    className="rounded border-gray-300 text-[#b50a0a] focus:ring-[#b50a0a] w-4 h-4"
                  />
                  <label htmlFor={`is_current_${index}`} className="text-xs font-bold text-gray-700 select-none">Currently working here</label>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Responsibilities (Optional, one per line)</label>
                  <textarea
                    disabled={disabled}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#b50a0a] outline-none resize-none disabled:bg-gray-50 disabled:text-gray-500"
                    value={(record.responsibilities || []).join('\n')}
                    onChange={(e) => updateExperience(index, 'responsibilities', e.target.value.split('\n').filter((l: string) => l.trim().length > 0))}
                    placeholder="e.g. Managed matchday injury assessments&#10;Led pre-season conditioning program"
                  />
                </div>
              </div>
            </div>
          ))}
          {(data.work_experience?.length || 0) === 0 && (
            <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
              <Briefcase className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">No experience recorded yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Qualifications & Certifications */}
      <div className="space-y-4 border-t border-gray-100 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-blue-600" /> Qualifications & Certifications</h3>
            <p className="text-sm text-gray-500 mt-1">Degrees, licenses, and professional certifications.</p>
          </div>
          {!disabled && (
            <button type="button" onClick={addQualification} className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-bold transition-colors">
              <Plus className="w-4 h-4" /> Add Qualification
            </button>
          )}
        </div>

        <div className="space-y-4">
          {(data.qualifications || []).map((record: any, index: number) => (
            <div key={index} className="p-5 bg-white border border-gray-200 rounded-2xl relative group shadow-sm hover:shadow-md transition-shadow">
              {!disabled && (
                <button type="button" onClick={() => removeQualification(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors bg-white rounded-lg p-1 z-10 opacity-0 group-hover:opacity-100" title="Remove Qualification">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Title</label>
                  <input type="text" disabled={disabled} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#b50a0a] outline-none disabled:bg-gray-50 disabled:text-gray-500" value={record.title || ''} onChange={(e) => updateQualification(index, 'title', e.target.value)} placeholder="e.g. UEFA Sports Medicine Diploma" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Issuing Body</label>
                  <input type="text" disabled={disabled} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#b50a0a] outline-none disabled:bg-gray-50 disabled:text-gray-500" value={record.issuing_body || ''} onChange={(e) => updateQualification(index, 'issuing_body', e.target.value)} placeholder="e.g. UEFA" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Date Obtained</label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    <input type="date" disabled={disabled} className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#b50a0a] outline-none disabled:bg-gray-50 disabled:text-gray-500" value={record.date_obtained || ''} onChange={(e) => updateQualification(index, 'date_obtained', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Expiry Date (Optional)</label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    <input type="date" disabled={disabled} className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#b50a0a] outline-none disabled:bg-gray-50 disabled:text-gray-500" value={record.expiry_date || ''} onChange={(e) => updateQualification(index, 'expiry_date', e.target.value)} />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Credential ID (Optional)</label>
                  <input type="text" disabled={disabled} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#b50a0a] outline-none disabled:bg-gray-50 disabled:text-gray-500" value={record.credential_id || ''} onChange={(e) => updateQualification(index, 'credential_id', e.target.value)} placeholder="e.g. UEFA-SM-2024-0123" />
                </div>
              </div>
            </div>
          ))}
          {(data.qualifications?.length || 0) === 0 && (
            <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
              <GraduationCap className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">No qualifications recorded yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Achievements & Awards */}
      {achievements !== undefined && onAchievementsChange && (
        <div className="space-y-4 border-t border-gray-100 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" /> Achievements & Awards</h3>
              <p className="text-sm text-gray-500 mt-1">Recognitions and awards earned in your career.</p>
            </div>
            {!disabled && (
              <button type="button" onClick={addAchievement} className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-bold transition-colors">
                <Plus className="w-4 h-4" /> Add Achievement
              </button>
            )}
          </div>

          <div className="space-y-4">
            {(achievements || []).map((record: any, index: number) => {
              const isString = typeof record === 'string';
              const title = isString ? record : record.title;
              const year = isString ? '' : (record.year || '');
              const category = isString ? 'Individual' : (record.category || 'Individual');

              return (
                <div key={index} className="p-5 bg-white border border-gray-200 rounded-2xl relative group shadow-sm hover:shadow-md transition-shadow">
                  {!disabled && (
                    <button type="button" onClick={() => removeAchievement(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors bg-white rounded-lg p-1 z-10 opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Achievement Title</label>
                      <input type="text" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#b50a0a] focus:ring-1 focus:ring-[#b50a0a] outline-none text-gray-900 disabled:bg-gray-50 disabled:text-gray-500" value={title} onChange={(e) => updateAchievement(index, 'title', e.target.value)} placeholder="e.g. Best Performance Analyst of the Year" disabled={disabled} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                        Year {!!title && <span className="text-red-500">*</span>}
                      </label>
                      <input required={!!title} type="text" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#b50a0a] focus:ring-1 focus:ring-[#b50a0a] outline-none text-gray-900 disabled:bg-gray-50 disabled:text-gray-500" value={year} onChange={(e) => updateAchievement(index, 'year', e.target.value)} placeholder="e.g. 2023" disabled={disabled} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                        Category {!!title && <span className="text-red-500">*</span>}
                      </label>
                      <select required={!!title} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#b50a0a] focus:ring-1 focus:ring-[#b50a0a] outline-none text-gray-900 disabled:bg-gray-50 disabled:text-gray-500" value={category} onChange={(e) => updateAchievement(index, 'category', e.target.value)} disabled={disabled}>
                        <option value="Individual">Individual</option>
                        <option value="Team">Team</option>
                        <option value="Organization">Organization</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
            {(achievements?.length || 0) === 0 && (
              <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
                <Trophy className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 font-medium">No achievements recorded yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
