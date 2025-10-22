'use client'

import { ImageVersion } from '@/app/page'
import { CheckCircle, Clock } from 'lucide-react'

type Props = {
  versions: ImageVersion[]
  onSelectVersion: (version: ImageVersion) => void
  currentVersion: ImageVersion | null
}

export default function VersionHistory({
  versions,
  onSelectVersion,
  currentVersion,
}: Props) {
  if (versions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Versjonshistorikk</h3>
        <p className="text-gray-500 text-sm">
          Ingen versjoner ennå. Generer ditt første bilde for å starte.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">
        Versjonshistorikk ({versions.length})
      </h3>

      <div className="space-y-3">
        {versions.map((version, index) => (
          <div
            key={version.id}
            onClick={() => onSelectVersion(version)}
            className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
              currentVersion?.id === version.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="font-semibold text-sm">
                Versjon {versions.length - index}
              </span>
              {version.approved && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>

            <img
              src={version.imageUrl}
              alt={`Version ${index + 1}`}
              className="w-full h-32 object-cover rounded mb-2"
            />

            <div className="text-xs text-gray-600 mb-1">
              <strong>Instruksjon:</strong>
              <p className="line-clamp-2">{version.prompt}</p>
            </div>

            {version.comment && (
              <div className="text-xs text-gray-600 mb-1">
                <strong>Kommentar:</strong>
                <p className="line-clamp-1">{version.comment}</p>
              </div>
            )}

            <div className="flex items-center text-xs text-gray-400 mt-2">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(version.timestamp).toLocaleTimeString('no-NO')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
