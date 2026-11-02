'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, School, Check, X, Loader2, MapPin, Building, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CollegeRecord } from '@/lib/registration/colleges-data';

interface CollegeAutocompleteProps {
  value: string;
  collegeId?: string;
  collegeCity?: string;
  onChange: (college: { id: string; name: string; city: string; state: string; isCustom?: boolean }) => void;
  error?: string;
}

export const CollegeAutocomplete: React.FC<CollegeAutocompleteProps> = ({
  value,
  collegeId,
  collegeCity,
  onChange,
  error,
}) => {
  const [query, setQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<CollegeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCustomSelected, setIsCustomSelected] = useState(collegeId === 'custom');

  // Custom college fields when "My college is not listed" is selected
  const [customCollege, setCustomCollege] = useState({
    name: isCustomSelected ? value : '',
    city: collegeCity || '',
    state: 'Uttar Pradesh',
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync internal query when prop changes from outside
  useEffect(() => {
    if (value && !isCustomSelected) {
      setQuery(value);
    }
  }, [value, isCustomSelected]);

  // Debounced search
  useEffect(() => {
    if (!isOpen || isCustomSelected) return;

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/colleges/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error('Failed to search colleges:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query, isOpen, isCustomSelected]);

  const handleSelectCollege = (col: CollegeRecord) => {
    setQuery(col.name);
    setIsCustomSelected(false);
    setIsOpen(false);
    onChange({
      id: col.id,
      name: col.name,
      city: col.city,
      state: col.state,
      isCustom: false,
    });
  };

  const handleChooseCustom = () => {
    setIsCustomSelected(true);
    setIsOpen(false);
    onChange({
      id: 'custom',
      name: customCollege.name || '',
      city: customCollege.city || '',
      state: customCollege.state || 'Uttar Pradesh',
      isCustom: true,
    });
  };

  const handleCustomFieldChange = (field: 'name' | 'city' | 'state', val: string) => {
    const updated = { ...customCollege, [field]: val };
    setCustomCollege(updated);
    onChange({
      id: 'custom',
      name: updated.name,
      city: updated.city,
      state: updated.state,
      isCustom: true,
    });
  };

  return (
    <div ref={containerRef} className="space-y-3">
      <div className="relative">
        <School className="absolute left-3.5 top-3 w-4 h-4 text-[#A89DB5]" />
        <input
          type="text"
          placeholder="Search by college name, abbreviation (e.g. GCET, KIET, DTU)..."
          value={isCustomSelected ? 'Custom / Institution Not Listed' : query}
          onChange={(e) => {
            if (isCustomSelected) setIsCustomSelected(false);
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={`w-full bg-[#1A0E2A]/70 border ${
            error ? 'border-red-500/80' : isOpen ? 'border-amber-400' : 'border-[#4C2A66]/60'
          } rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none transition`}
        />

        {loading ? (
          <Loader2 className="absolute right-3.5 top-3 w-4 h-4 text-amber-400 animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsCustomSelected(false);
              onChange({ id: '', name: '', city: '', state: '', isCustom: false });
            }}
            className="absolute right-3 top-2.5 p-1 text-[#A89DB5] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}

        {/* Dropdown Results */}
        <AnimatePresence>
          {isOpen && !isCustomSelected && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl bg-[#140C20] border border-[#4C2A66] shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl overflow-hidden flex flex-col max-h-72"
            >
              <div className="overflow-y-auto p-1.5 divide-y divide-[#4C2A66]/20">
                {results.length === 0 && !loading ? (
                  <div className="py-6 text-center text-xs text-[#A89DB5]">
                    No matching colleges found in directory.
                  </div>
                ) : (
                  results.map((col) => {
                    const isSelected = col.name === value;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => handleSelectCollege(col)}
                        className={`w-full px-3 py-2.5 rounded-xl text-left text-xs transition flex items-start justify-between ${
                          isSelected
                            ? 'bg-amber-400 text-black font-semibold'
                            : 'text-[#E2D9F3] hover:bg-[#231438] hover:text-white'
                        }`}
                      >
                        <div className="space-y-0.5 pr-2">
                          <div className="font-medium leading-snug">{col.name}</div>
                          <div
                            className={`flex items-center gap-2 text-[10px] ${
                              isSelected ? 'text-black/70' : 'text-[#A89DB5]'
                            }`}
                          >
                            <span className="flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 shrink-0" />
                              {col.city}, {col.state}
                            </span>
                            <span>•</span>
                            <span className="font-mono">{col.aliases[0]}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 shrink-0 text-black mt-1" />}
                      </button>
                    );
                  })
                )}

                {/* "My college is not listed" option */}
                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={handleChooseCustom}
                    className="w-full px-3 py-2.5 rounded-xl text-left text-xs text-amber-300 hover:bg-[#231438] hover:text-amber-200 transition font-medium flex items-center justify-between"
                  >
                    <span>➕ My college / university is not listed</span>
                    <span className="text-[10px] font-mono text-[#A89DB5]">Enter manually</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Manual Input Fields when "My college is not listed" is selected */}
      {isCustomSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 rounded-2xl bg-[#1A0E2A]/60 border border-amber-400/40 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-amber-300">
              Manual Institution Details
            </span>
            <button
              type="button"
              onClick={() => {
                setIsCustomSelected(false);
                setQuery('');
              }}
              className="text-[11px] text-[#A89DB5] hover:text-white underline"
            >
              Back to search
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#C4B5DA] mb-1">
              Official College / University Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Government Polytechnic College"
              value={customCollege.name}
              onChange={(e) => handleCustomFieldChange('name', e.target.value)}
              className="w-full bg-[#12071E] border border-[#4C2A66]/60 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-mono text-[#C4B5DA] mb-1">City *</label>
              <input
                type="text"
                placeholder="City"
                value={customCollege.city}
                onChange={(e) => handleCustomFieldChange('city', e.target.value)}
                className="w-full bg-[#12071E] border border-[#4C2A66]/60 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#C4B5DA] mb-1">State *</label>
              <input
                type="text"
                placeholder="State"
                value={customCollege.state}
                onChange={(e) => handleCustomFieldChange('state', e.target.value)}
                className="w-full bg-[#12071E] border border-[#4C2A66]/60 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
