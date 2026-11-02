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

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options based on search query
  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opt.category && opt.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group by category if available
  const groupedOptions: Record<string, ComboboxOption[]> = {};
  filteredOptions.forEach((opt) => {
    const cat = opt.category || 'General';
    if (!groupedOptions[cat]) groupedOptions[cat] = [];
    groupedOptions[cat].push(opt);
  });

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
    triggerRef.current?.focus(); // The focused option unmounts: don't drop keyboard users to <body>.
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
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
          error ? 'border-red-500/80' : isOpen ? 'border-amber-400' : 'border-[#4C2A66]/60'
        } rounded-xl px-4 py-2.5 text-sm text-left flex items-center justify-between transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span className={`truncate ${selectedOption ? 'text-white' : 'text-white/30'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {value && !disabled && (
            <X
              onClick={handleClear}
              className="w-3.5 h-3.5 text-[#A89DB5] hover:text-white transition cursor-pointer"
            />
          )}
          <ChevronDown
            className={`w-4 h-4 text-[#A89DB5] transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-amber-400' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl bg-[#140C20] border border-[#4C2A66] shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl overflow-hidden flex flex-col max-h-72"
          >
            {/* Search Input Box */}
            <div className="p-2 border-b border-[#4C2A66]/50 bg-[#1A0E2A]/60 flex items-center gap-2">
              <Search className="w-4 h-4 text-[#A89DB5] shrink-0 ml-1.5" />
              <input
                ref={inputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder-white/30 focus:outline-none py-1.5"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 hover:bg-white/10 rounded-md text-[#A89DB5]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Options List */}
            <div className="overflow-y-auto p-1.5 space-y-1 divide-y divide-[#4C2A66]/20">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#A89DB5]">
                  {emptyMessage}
                </div>
              ) : (
                Object.entries(groupedOptions).map(([category, items]) => (
                  <div key={category} className="pt-1.5 first:pt-0">
                    {category !== 'General' && (
                      <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-amber-400/80 font-bold">
                        {category}
                      </div>
                    )}
                    <div className="space-y-0.5">
                      {items.map((opt) => {
                        const isSelected = opt.value === value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleSelect(opt.value)}
                            className={`w-full px-3 py-2 rounded-xl text-left text-xs transition flex items-center justify-between ${
                              isSelected
                                ? 'bg-amber-400 text-black font-semibold'
                                : 'text-[#E2D9F3] hover:bg-[#231438] hover:text-white'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <div>{opt.label}</div>
                              {opt.sublabel && (
                                <div
                                  className={`text-[10px] truncate ${
                                    isSelected ? 'text-black/70' : 'text-[#A89DB5]'
                                  }`}
                                >
                                  {opt.sublabel}
                                </div>
                              )}
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-black" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}

              {/* Custom 'Other' Option */}
              {allowCustom && (
                <div className="pt-1.5 border-t border-[#4C2A66]/40">
                  <button
                    type="button"
                    onClick={() => {
                      if (onCustomSelect) onCustomSelect();
                      handleSelect('Other');
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-left text-xs transition flex items-center justify-between ${
                      value === 'Other'
                        ? 'bg-amber-400 text-black font-semibold'
                        : 'text-amber-300 hover:bg-[#231438] hover:text-amber-200'
                    }`}
                  >
                    <span>{customOptionLabel}</span>
                    {value === 'Other' && <Check className="w-3.5 h-3.5 shrink-0 text-black" />}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

