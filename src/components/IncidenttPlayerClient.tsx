// src/components/IncidentPlayerClient.tsx
'use client';

import { Incident } from '@/types';
import { format } from 'date-fns';
import { BsCameraVideoFill } from 'react-icons/bs';

interface IncidentPlayerClientProps {
  selectedIncident: Incident | null;
}

export default function IncidentPlayerClient({ selectedIncident }: IncidentPlayerClientProps) {
  if (!selectedIncident) {
    return (
      <div className="w-2/3 p-4 flex items-center justify-center bg-gray-200 text-gray-700 rounded-lg shadow-lg">
        <p className="text-gray-600 text-lg">Select an incident to view details.</p>
      </div>
    );
  }

  return (
    <div className="w-2/3 p-4 bg-white shadow-lg rounded-lg flex flex-col">

      {/* Main Video Player Area */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
        {selectedIncident.videoUrl ? (
          <video
            key={selectedIncident.id}
            src={selectedIncident.videoUrl}
            poster={selectedIncident.thumbnailUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        ) : selectedIncident.thumbnailUrl ? (
          <img
            src={selectedIncident.thumbnailUrl}
            alt="Incident Thumbnail"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-gray-500">No media available</div>
        )}
      </div>

      {/* Incident Details Section */}
      <div className="mt-4 p-4 border-t border-gray-200">
        <h3 className="text-2xl font-bold mb-2 text-gray-800">{selectedIncident.type}</h3>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">Camera:</span> {selectedIncident.camera.name} ({selectedIncident.camera.location})
        </p>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">Start Time:</span> {format(new Date(selectedIncident.tsStart), 'MMM dd, yyyy hh:mm:ss a')}
        </p>
        {selectedIncident.tsEnd && (
          <p className="text-lg text-gray-700 mb-2">
            <span className="font-semibold">End Time:</span> {format(new Date(selectedIncident.tsEnd), 'MMM dd, yyyy hh:mm:ss a')}
          </p>
        )}
        <p className="text-lg text-gray-700">
          <span className="font-semibold">Status:</span> {selectedIncident.resolved ? 'Resolved' : 'Unresolved'}
        </p>
      </div>

      {/* Additional Thumbnails Section */}
      <div className="mt-4 p-4 border-t border-gray-200">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Additional Views</h3>
        {selectedIncident.additionalThumbnail1Url || selectedIncident.additionalThumbnail2Url ? (
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {selectedIncident.additionalThumbnail1Url && (
              <div className="flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden shadow-md relative group">
                <img
                  src={selectedIncident.additionalThumbnail1Url}
                  alt={`Additional view from ${selectedIncident.additionalCamera1Name || 'another camera'}`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} // Hide if image fails to load
                />
                {selectedIncident.additionalCamera1Name && (
                  <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    {selectedIncident.additionalCamera1Name}
                  </div>
                )}
              </div>
            )}
            {selectedIncident.additionalThumbnail2Url && (
              <div className="flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden shadow-md relative group">
                <img
                  src={selectedIncident.additionalThumbnail2Url}
                  alt={`Additional view from ${selectedIncident.additionalCamera2Name || 'another camera'}`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} // Hide if image fails to load
                />
                {selectedIncident.additionalCamera2Name && (
                  <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    {selectedIncident.additionalCamera2Name}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-center">No additional views available.</div>
        )}
      </div>
    </div>
  );
}