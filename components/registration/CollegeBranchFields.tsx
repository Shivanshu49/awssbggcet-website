'use client';

import React, { useState } from 'react';

import eventPage from '@/content/event-pages/aws-student-community-day-2026.json';
import { FIELD_ERROR, FIELD_INPUT, FIELD_LABEL, fieldBorder } from './field-styles';
import { SearchableCombobox } from './SearchableCombobox';

const { allowOtherColleges, colleges, branches } = eventPage;

const OTHER = 'Other';
const toOption = (value: string) => ({ value, label: value });
const COLLEGE_OPTIONS = [...colleges, OTHER].map(toOption);
const BRANCH_OPTIONS = branches.map(toOption);

// Starting value for the form's `college` state. With other colleges turned off
// the field is fixed to the first entry, so it must start valid.
export const INITIAL_COLLEGE = allowOtherColleges ? '' : colleges[0];

type CollegeBranchFieldsProps = {
  college: string;
  branch: string;
  onCollegeChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  collegeError?: string;
  branchError?: string;
};

// `college` holds what gets saved: a listed name or the typed one, never "Other".
export function CollegeBranchFields({
  college,
  branch,
  onCollegeChange,
  onBranchChange,
  collegeError,
  branchError,
}: CollegeBranchFieldsProps) {
  const [isOtherCollege, setIsOtherCollege] = useState(false);

  const handleCollegePick = (value: string) => {
    setIsOtherCollege(value === OTHER);
    onCollegeChange(value === OTHER ? '' : value);
  };

  return (
    <>
      <div>
        <label id="college-label" htmlFor="college" className={FIELD_LABEL}>
          College *
        </label>
        {allowOtherColleges ? (
          <SearchableCombobox
            id="college"
            aria-labelledby="college-label college"
            aria-invalid={Boolean(collegeError) && !isOtherCollege}
            aria-describedby={collegeError && !isOtherCollege ? 'college-error' : undefined}
            options={COLLEGE_OPTIONS}
            value={isOtherCollege ? OTHER : college}
            onChange={handleCollegePick}
            placeholder="Select your college"
            searchPlaceholder="Search colleges..."
            error={isOtherCollege ? undefined : collegeError}
          />
        ) : (
          <input id="college" readOnly value={college} className={`${FIELD_INPUT} ${fieldBorder()}`} />
        )}
        {isOtherCollege && (
          <div className="mt-3">
            <label htmlFor="college-other" className={FIELD_LABEL}>
              College or university name *
            </label>
            <input
              id="college-other"
              type="text"
              autoComplete="organization"
              value={college}
              onChange={(e) => onCollegeChange(e.target.value)}
              aria-invalid={Boolean(collegeError)}
              aria-describedby={collegeError ? 'college-error' : undefined}
              className={`${FIELD_INPUT} ${fieldBorder(collegeError)}`}
            />
          </div>
        )}
        {collegeError && (
          <p id="college-error" className={FIELD_ERROR}>
            {collegeError}
          </p>
        )}
      </div>

      <div>
        <label id="branch-label" htmlFor="branch" className={FIELD_LABEL}>
          Branch *
        </label>
        <SearchableCombobox
          id="branch"
          aria-labelledby="branch-label branch"
          aria-invalid={Boolean(branchError)}
          aria-describedby={branchError ? 'branch-error' : undefined}
          options={BRANCH_OPTIONS}
          value={branch}
          onChange={onBranchChange}
          placeholder="Select your branch"
          searchPlaceholder="Search branches..."
          error={branchError}
        />
        {branchError && (
          <p id="branch-error" className={FIELD_ERROR}>
            {branchError}
          </p>
        )}
      </div>
    </>
  );
}
