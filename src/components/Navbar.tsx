// src/components/Navbar.tsx
// --- LATEST STATE (after Step 9) ---
'use client'; // This component needs to be a Client Component for interaction

import Link from 'next/link';
import IncidentTypeFilterDropdown from './IncidentTypeFilterDropdown'; // Import the new dropdown

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 shadow-md fixed w-full top-0 left-0 z-50"> {/* Added fixed positioning */}
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-white text-2xl font-bold">
          SecureSight
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Dashboard
          </Link>
          {/* Add other Navbar links here if needed, e.g., Cameras, Scenes, Incidents, Users */}

          {/* Incident Type Filter Dropdown */}
          <IncidentTypeFilterDropdown />

          {/* User/Auth related part */}
          {/* <div className="text-white ml-4">
            Hello, User!
          </div> */}
        </div>
      </div>
    </nav>
  );
}