// app/dashboard/page.tsx
import { Incident } from '@/types';
import IncidentListClient from '@/src/components/IncidentListClient';

export default async function DashboardPage() {
  // --- MODIFIED: No longer directly accessing searchParams here ---
  // We will fetch a default set of unresolved incidents on the server
  // The client component will handle specific filtering based on search params.
  const apiUrl = new URL('http://localhost:3000/api/incidents');
  apiUrl.searchParams.set('resolved', 'false'); // Default server-side fetch to unresolved

  const res = await fetch(apiUrl.toString(), {
    next: { tags: ['incidents'] },
  });

  if (!res.ok) {
    return <div className="p-4 text-red-500">Failed to fetch incidents: {res.statusText}</div>;
  }

  const incidents: Incident[] = await res.json();

  return (
    // Pass the initial data and let IncidentListClient handle dynamic filtering
    <IncidentListClient
      initialIncidents={incidents}
      initialResolvedFilter={'false'} // Pass the initial filter state (unresolved)
      // searchParams will be accessed directly by IncidentListClient using useSearchParams
    />
  );
}