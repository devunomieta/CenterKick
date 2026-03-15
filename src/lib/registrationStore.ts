"use client";

const STORAGE_KEY = 'centerkick_registration_data';

export interface RegistrationData {
   role?: string;
   details?: {
      fullName?: string;
      dob?: string;
      location?: string;
      email?: string;
      phone?: string;
      // Athlete specific
      position?: string;
      jerseyNumber?: string;
      preferredFoot?: string;
      // Coach specific
      experience?: string;
      license?: string;
      // Agent specific
      agencyName?: string;
      fifaLicense?: string;
   };
   plan?: string;
   step?: number;
}

export const saveRegistrationData = (data: Partial<RegistrationData>) => {
   if (typeof window === 'undefined') return;
   const existing = getRegistrationData();
   const updated = { ...existing, ...data };
   localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getRegistrationData = (): RegistrationData => {
   if (typeof window === 'undefined') return {};
   const saved = localStorage.getItem(STORAGE_KEY);
   return saved ? JSON.parse(saved) : {};
};

export const clearRegistrationData = () => {
   if (typeof window === 'undefined') return;
   localStorage.removeItem(STORAGE_KEY);
};
