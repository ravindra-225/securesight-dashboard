// src/components/IncidentTypeFilterDropdown.tsx
// --- NEW FILE (from Step 9) ---
'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ALL_INCIDENT_TYPES = [
  'Unauthorized Access',
  'Gun Threat',
  'Face Recognized',
  'Suspicious Activity',
  'Vandalism',
];

export default function IncidentTypeFilterDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for clicking outside to close

  const currentTypeFilter = searchParams.get('type') || ''; // Get current filter from URL

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);


  const handleFilterChange = (type: string) => {
    startTransition(() => {
      const newFilter = currentTypeFilter === type ? '' : type; // Toggle filter

      const params = new URLSearchParams(searchParams.toString());
      if (newFilter) {
        params.set('type', newFilter);
      } else {
        params.delete('type');
      }
      router.replace(`?${params.toString()}`); // Update the URL
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center px-4 py-2 rounded-md text-white font-medium
                    ${currentTypeFilter ? 'bg-blue-700' : 'bg-transparent hover:bg-gray-700'}
                    ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isPending}
      >
        Incident Types
        <svg
          className={`ml-2 h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="p-3 space-y-2">
            {ALL_INCIDENT_TYPES.map((type) => (
              <label key={type} className="flex items-center text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 rounded"
                  checked={currentTypeFilter === type}
                  onChange={() => handleFilterChange(type)}
                  disabled={isPending}
                />
                <span className="ml-2 text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}