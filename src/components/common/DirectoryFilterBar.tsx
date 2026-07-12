'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Filter, Users, X } from 'lucide-react';

interface DirectoryFilterBarProps {
  totalCount: number;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCountry: string;
  setSelectedCountry: (val: string) => void;
  availableCountries: string[];
  searchPlaceholder?: string;
  profileTypeLabel?: string;
}

export function DirectoryFilterBar({
  totalCount,
  searchQuery,
  setSearchQuery,
  selectedCountry,
  setSelectedCountry,
  availableCountries,
  searchPlaceholder = "Search...",
  profileTypeLabel = "Profiles"
}: DirectoryFilterBarProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        if (!searchQuery) setIsSearchExpanded(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        if (!selectedCountry) setIsFilterExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery, selectedCountry]);

  // If a filter is active, force it to stay expanded so user sees the active state
  useEffect(() => {
    if (searchQuery) setIsSearchExpanded(true);
    if (selectedCountry) setIsFilterExpanded(true);
  }, [searchQuery, selectedCountry]);

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-gray-100">
      {/* Users Count Pill */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 h-10 sm:h-11 transition-all cursor-default shrink-0">
         <Users className="w-4 h-4 text-gray-500" />
         <span className="text-sm font-bold text-gray-900">{totalCount} <span className="hidden sm:inline">{profileTypeLabel}</span></span>
      </div>

      {/* Search Pill */}
      <div 
        ref={searchRef}
        className={`relative flex items-center bg-gray-50 border border-gray-200 rounded-full h-10 sm:h-11 transition-all duration-300 overflow-hidden shrink-0 ${isSearchExpanded ? 'w-[200px] sm:w-[260px] px-4' : 'px-3 sm:px-4 justify-center cursor-pointer hover:bg-gray-100'}`}
        onClick={() => {
            if (!isSearchExpanded) {
              setIsSearchExpanded(true);
              setIsFilterExpanded(false); // Close filter if open
            }
          }}
        >
           {isSearchExpanded ? (
              <>
                 <Search className="w-4 h-4 text-gray-400 shrink-0 mr-2" />
                 <input
                   type="text"
                   placeholder={searchPlaceholder}
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="bg-transparent border-none outline-none w-full text-sm font-bold text-gray-900 placeholder:font-normal placeholder:text-gray-400"
                   autoFocus
                 />
                 {searchQuery && (
                   <button 
                     type="button"
                     className="p-1 hover:bg-gray-200 rounded-full ml-1 shrink-0"
                     onClick={(e) => {
                       e.stopPropagation();
                       setSearchQuery('');
                     }}
                   >
                     <X className="w-3.5 h-3.5 text-gray-500" />
                   </button>
                 )}
              </>
           ) : (
              <div className="flex items-center gap-2">
                 <Search className="w-4 h-4 text-gray-500 shrink-0" />
                 <span className="text-sm font-bold text-gray-700 whitespace-nowrap">Search</span>
              </div>
           )}
        </div>

         {/* Filter Pill */}
         <div 
           ref={filterRef}
           className={`relative flex items-center bg-gray-50 border border-gray-200 rounded-full h-10 sm:h-11 transition-all duration-300 overflow-hidden shrink-0 ${isFilterExpanded ? 'w-[180px] sm:w-[220px] px-4' : 'px-3 sm:px-4 justify-center cursor-pointer hover:bg-gray-100'}`}
           onClick={() => {
            if (!isFilterExpanded) {
              setIsFilterExpanded(true);
              setIsSearchExpanded(false); // Close search if open
            }
          }}
        >
           {isFilterExpanded ? (
              <>
                 <Filter className="w-4 h-4 text-gray-400 shrink-0 mr-2" />
                 <select
                   value={selectedCountry}
                   onChange={(e) => setSelectedCountry(e.target.value)}
                   className="bg-transparent border-none outline-none w-full text-sm font-bold text-gray-900 cursor-pointer appearance-none truncate"
                 >
                   <option value="">All Countries</option>
                   {availableCountries.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 {selectedCountry ? (
                   <button 
                     type="button"
                     className="p-1 hover:bg-gray-200 rounded-full ml-1 shrink-0"
                     onClick={(e) => {
                       e.stopPropagation();
                       setSelectedCountry('');
                     }}
                   >
                     <X className="w-3.5 h-3.5 text-gray-500" />
                   </button>
                 ) : (
                    <div className="w-3.5 h-3.5 shrink-0 ml-1 pointer-events-none flex items-center justify-center">
                       <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                 )}
              </>
           ) : (
              <div className="flex items-center gap-2">
                 <Filter className="w-4 h-4 text-gray-500 shrink-0" />
                 <span className="text-sm font-bold text-gray-700 whitespace-nowrap">Filter</span>
              </div>
           )}
      </div>
    </div>
  );
}
