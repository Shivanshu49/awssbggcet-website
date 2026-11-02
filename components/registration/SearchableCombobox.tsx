'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ComboboxOption {
  value: string;
  label: string;
  category?: string;
  sublabel?: string;
}

type TriggerProps = Pick<
  React.ComponentProps<'button'>,
  'id' | 'aria-labelledby' | 'aria-describedby' | 'aria-invalid'
>;

interface SearchableComboboxProps extends TriggerProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  error?: string;
  allowCustom?: boolean;
  customOptionLabel?: string;
  onCustomSelect?: () => void;
  className?: string;
}

export const SearchableCombobox: React.FC<SearchableComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found.',
  disabled = false,
  error,
  allowCustom = false,
  customOptionLabel = 'Other / Not Listed',
  onCustomSelect,
  className = '',
  ...triggerProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Filter options based on search query
  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group filtered options by category if any category exists
  const hasCategories = options.some((opt) => opt.category);
  const groupedOptions = hasCategories
    ? filteredOptions.reduce<Record<string, ComboboxOption[]>>((acc, opt) => {
        const cat = opt.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(opt);
        return acc;
      }, {})
    : null;

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  const handleClear = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        {...triggerProps}
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full bg-[#1A0E2A]/70 border ${
          error ? 'border-red-500 focus:border-red-500' : 'border-[#4A2060] focus:border-[#FBBF24]'
        } rounded-xl px-4 py-3 text-left flex items-center justify-between text-white text-sm outline-none transition-all duration-200 hover:border-[#7A3A9E] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-inner backdrop-blur-sm`}
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-400' : 'text-white'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-1.5 ml-2 shrink-0">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleClear(e);
                }
              }}
              className="text-gray-400 hover:text-white p-0.5 rounded transition-colors"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#FBBF24]' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 z-50 mt-1 max-h-72 bg-[#12071F] border border-[#5B2577] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden flex flex-col"
          >
            {/* Search Input Box */}
            <div className="p-2.5 border-b border-[#361347] bg-[#180A2A] sticky top-0 z-10 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400 shrink-0 ml-1" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm text-white placeholder-gray-400 outline-none pr-2 font-normal"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Options List */}
            <div className="overflow-y-auto max-h-56 p-1.5 space-y-1 custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  <p>{emptyMessage}</p>
                  {allowCustom && (
                    <button
                      type="button"
                      onClick={() => {
                        handleSelect('Other');
                        if (onCustomSelect) onCustomSelect();
                      }}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-[#FBBF24] hover:underline font-semibold"
                    >
                      + Use &quot;{customOptionLabel}&quot;
                    </button>
                  )}
                </div>
              ) : groupedOptions ? (
                Object.entries(groupedOptions).map(([category, opts]) => (
                  <div key={category} className="mb-2">
                    <div className="px-3 py-1 text-[11px] font-mono tracking-wider text-purple-400 uppercase font-semibold bg-[#1C0B30]/50 rounded-md mb-1">
                      {category}
                    </div>
                    {opts.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelect(opt.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          value === opt.value
                            ? 'bg-[#FBBF24] text-black font-semibold'
                            : 'text-gray-200 hover:bg-[#2A1145] hover:text-white'
                        }`}
                      >
                        <div className="flex flex-col truncate pr-2">
                          <span className="truncate">{opt.label}</span>
                          {opt.sublabel && (
                            <span
                              className={`text-[10px] ${
                                value === opt.value ? 'text-black/70' : 'text-gray-400'
                              }`}
                            >
                              {opt.sublabel}
                            </span>
                          )}
                        </div>
                        {value === opt.value && <Check className="w-4 h-4 shrink-0 text-black" />}
                      </button>
                    ))}
                  </div>
                ))
              ) : (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      value === opt.value
                        ? 'bg-[#FBBF24] text-black font-semibold'
                        : 'text-gray-200 hover:bg-[#2A1145] hover:text-white'
                    }`}
                  >
                    <div className="flex flex-col truncate pr-2">
                      <span className="truncate">{opt.label}</span>
                      {opt.sublabel && (
                        <span
                          className={`text-[10px] ${
                            value === opt.value ? 'text-black/70' : 'text-gray-400'
                          }`}
                        >
                          {opt.sublabel}
                        </span>
                      )}
                    </div>
                    {value === opt.value && <Check className="w-4 h-4 shrink-0 text-black" />}
                  </button>
                ))
              )}

              {/* Custom 'Other' Option at bottom if enabled and query has no match */}
              {allowCustom && filteredOptions.length > 0 && !options.some((o) => o.value === 'Other') && (
                <div className="pt-1 mt-1 border-t border-[#361347]">
                  <button
                    type="button"
                    onClick={() => {
                      handleSelect('Other');
                      if (onCustomSelect) onCustomSelect();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      value === 'Other'
                        ? 'bg-[#FBBF24] text-black font-semibold'
                        : 'text-purple-300 hover:bg-[#2A1145] hover:text-[#FBBF24]'
                    }`}
                  >
                    <span>+ {customOptionLabel}</span>
                    {value === 'Other' && <Check className="w-4 h-4 shrink-0 text-black" />}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Field Error Message */}
      {error && <p className="mt-1.5 text-xs text-red-400 font-medium pl-1">{error}</p>}
    </div>
  );
};
