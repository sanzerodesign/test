'use client'

import { useState } from 'react'
import { Wand2, CheckCircle, Loader2 } from 'lucide-react'
import { UploadedImage, ImageVersion } from '@/app/page'

type Props = {
  images: UploadedImage[]
  onGenerateImage: (version: ImageVersion) => void
  onApproveVersion: (versionId: string) => void
  currentVersion: ImageVersion | null
}

export default function ImageComposer({
  images,
  onGenerateImage,
  onApproveVersion,
  currentVersion,
}: Props) {
  const [prompt, setPrompt] = useState('')
  const [comment, setComment] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const mainImage = images.find(img => img.type === 'main')
  const elementImages = images.filter(img => img.type === 'element')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Vennligst beskriv hva du ønsker å gjøre med bildene')
      return
    }

    setIsGenerating(true)

    try {
      // Prepare form data
      const formData = new FormData()
      formData.append('prompt', prompt)

      images.forEach((img, index) => {
        formData.append(`image_${index}`, img.file)
        formData.append(`image_${index}_type`, img.type)
        formData.append(`image_${index}_description`, img.description || '')
      })

      // Call API
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Generering feilet')
      }

      const data = await response.json()

      // Create new version
      const newVersion: ImageVersion = {
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: data.imageUrl,
        prompt: prompt,
        comment: comment,
        timestamp: new Date(),
        approved: false,
      }

      onGenerateImage(newVersion)
      setComment('')
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Det oppstod en feil under generering. Se console for detaljer.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApprove = () => {
    if (currentVersion) {
      onApproveVersion(currentVersion.id)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Komponér bilde</h2>

      {/* Image preview */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Bilder som brukes:</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {mainImage && (
            <div className="relative">
              <img
                src={mainImage.preview}
                alt="Main"
                className="w-full h-24 object-cover rounded border-2 border-blue-500"
              />
              <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                Hovedbilde
              </span>
            </div>
          )}
          {elementImages.map(img => (
            <div key={img.id} className="relative">
              <img
                src={img.preview}
                alt="Element"
                className="w-full h-24 object-cover rounded border border-gray-300"
              />
              {img.description && (
                <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                  {img.description}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current generated image */}
      {currentVersion && (
        <div className="mb-6 border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">Generert bilde:</h3>
          <img
            src={currentVersion.imageUrl}
            alt="Generated"
            className="w-full rounded-lg shadow-md mb-3"
          />
          <div className="text-sm text-gray-600 mb-2">
            <strong>Instruksjon:</strong> {currentVersion.prompt}
          </div>
          {currentVersion.comment && (
            <div className="text-sm text-gray-600 mb-2">
              <strong>Kommentar:</strong> {currentVersion.comment}
            </div>
          )}
        </div>
      )}

      {/* Prompt input */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">
          Hva ønsker du å gjøre med bildene?
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="F.eks. 'Plasser steinbenkeplaten på kjøkkenbenken og legg til kaffemaskinen på venstre side'"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
        />
      </div>

      {/* Comment input */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">
          Kommentar til endringen (valgfritt)
        </label>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="F.eks. 'Prøv med lysere benkeplate'"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Action buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Genererer...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Generer bilde
            </>
          )}
        </button>

        {currentVersion && !currentVersion.approved && (
          <button
            onClick={handleApprove}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Godkjenn
          </button>
        )}
      </div>
    </div>
  )
}
