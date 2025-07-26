// src/components/IncidentListClient.tsx
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Incident } from '@/types';
import IncidentPlayerClient from './IncidenttPlayerClient';
import { resolveIncident } from '@/src/actions/incidents';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns'; // For date formatting in the list

// Helper function for incident type colors (kept here as it's used for incident tags in the list)
function getIncidentTypeColor(type: string): string {
  switch (type) {
    case 'Unauthorized Access':
      return 'bg-red-500 text-white';
    case 'Gun Threat':
      return 'bg-red-700 text-white';
    case 'Face Recognized':
      return 'bg-blue-500 text-white';
    case 'Suspicious Activity':
      return 'bg-yellow-500 text-black';
    case 'Vandalism':
      return 'bg-purple-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

interface IncidentListClientProps {
  initialIncidents: Incident[];
  initialResolvedFilter: string; // 'true' or 'false'
}

export default function IncidentListClient({ initialIncidents, initialResolvedFilter }: IncidentListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null); // Start with null
  const [showResolved, setShowResolved] = useState<boolean>(initialResolvedFilter === 'true');

  // Primary useEffect for fetching data based on URL search parameters
  useEffect(() => {
    startTransition(async () => {
      const apiUrl = new URL(`${window.location.origin}/api/incidents`);

      // Get current resolved filter from URL, default to 'false' (unresolved)
      const resolvedParam = searchParams.get('resolved') || 'false';
      apiUrl.searchParams.set('resolved', resolvedParam);

      // Get current type filter from URL. Only add if it's not 'All' or empty.
      const typeParam = searchParams.get('type');
      if (typeParam && typeParam !== 'All') {
        apiUrl.searchParams.set('type', typeParam);
      }

      // Update local state for the resolved toggle to reflect the URL
      setShowResolved(resolvedParam === 'true');

      try {
        const res = await fetch(apiUrl.toString());
        if (!res.ok) {
          throw new Error(`Failed to fetch incidents: ${res.statusText}`);
        }
        const data: Incident[] = await res.json();
        setIncidents(data);

        // Crucial: Adjust selected incident based on the *newly fetched data*
        // If no incident is selected, or the previously selected one is no longer in the list,
        // select the first one from the new list (if available).
        if (!selectedIncident || !data.some(inc => inc.id === selectedIncident.id)) {
          setSelectedIncident(data.length > 0 ? data[0] : null);
        }
      } catch (error) {
        console.error('Error re-fetching incidents:', error);
        // Implement user-friendly error display here if needed
      }
    });
  }, [searchParams, startTransition]); // Dependency array: re-run when searchParams change

  // Additional useEffect to handle initial incident selection when initialIncidents prop changes
  // This helps ensure a video is selected if the component initially renders with data
  useEffect(() => {
    if (initialIncidents.length > 0 && !selectedIncident) {
      setSelectedIncident(initialIncidents[0]);
    }
  }, [initialIncidents, selectedIncident]); // Depend on initialIncidents and selectedIncident state

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncident(incident);
  };

  const handleResolve = async (incidentId: string) => {
    // Optimistic UI update only if currently viewing unresolved incidents
    // If we're showing resolved, we don't remove it from the list immediately
    if (!showResolved) {
      const updatedIncidents = incidents.filter(inc => inc.id !== incidentId);
      setIncidents(updatedIncidents);
      // If the resolved incident was currently selected, select the next one
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(updatedIncidents.length > 0 ? updatedIncidents[0] : null);
      }
    }

    try {
      await resolveIncident(incidentId); // Call the server action
      // The revalidateTag in the server action will trigger a re-render of the server component
      // and thus update the `initialIncidents` prop, which then triggers the main `useEffect` here
      // to re-fetch incidents, ensuring state consistency.
    } catch (error) {
      console.error("Failed to resolve incident:", error);
      // In a production app, consider reverting optimistic UI update here
    }
  };

  // Handler for only the 'resolved' filter toggle buttons
  const handleResolvedFilterChange = (value: boolean) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      // Update the 'resolved' parameter in the URL
      params.set('resolved', value.toString());
      // The `useEffect` will pick up this URL change and re-fetch data
      router.replace(`?${params.toString()}`);
    });
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100 pt-4"> {/* Adjusted height for Navbar */}
      <IncidentPlayerClient selectedIncident={selectedIncident} />

      <div className="w-1/3 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {showResolved ? 'Resolved Incidents' : 'Unresolved Incidents'} ({incidents.length})
        </h2>

        {/* Resolved/Unresolved Toggle Buttons */}
        <div className="mb-4 flex space-x-2">
          <button
            onClick={() => handleResolvedFilterChange(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium
              ${!showResolved ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
              ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isPending}
          >
            Unresolved
          </button>
          <button
            onClick={() => handleResolvedFilterChange(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium
              ${showResolved ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
              ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isPending}
          >
            Resolved
          </button>
        </div>

        {incidents.length === 0 ? (
          <p className="text-gray-600">No {showResolved ? 'resolved' : 'unresolved'} incidents found {searchParams.get('type') ? `for type "${searchParams.get('type')}"` : ''}. All clear!</p>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className={`bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 cursor-pointer
                          ${selectedIncident?.id === incident.id ? 'border-2 border-blue-500' : 'hover:bg-gray-50'}`}
                onClick={() => handleIncidentClick(incident)}
              >
                <img
                  src={incident.thumbnailUrl}
                  alt={`Incident ${incident.id}`}
                  className="w-24 h-16 object-cover rounded"
                />
                <div className="flex-grow">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIncidentTypeColor(incident.type)}`}
                  >
                    {incident.type}
                  </span>
                  <p className="text-gray-800 font-semibold mt-1">{incident.camera.name} ({incident.camera.location})</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(incident.tsStart), 'MMM dd, yyyy hh:mm:ss a')}
                  </p>
                </div>
                {!showResolved && (
                  <div>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleResolve(incident.id);
                    }}>
                      <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        disabled={isPending}
                      >
                        Resolve
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}