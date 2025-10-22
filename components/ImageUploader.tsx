'use client'

import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { UploadedImage } from '@/app/page'

type Props = {
  onImagesUploaded: (images: UploadedImage[]) => void
}

export default function ImageUploader({ onImagesUploaded }: Props) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [mainImageId, setMainImageId] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (images.length + files.length > 6) {
      alert('Du kan maksimalt laste opp 6 bilder')
      return
    }

    const newImages: UploadedImage[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      type: 'element',
    }))

    const updatedImages = [...images, ...newImages]
    setImages(updatedImages)

    // Set first image as main if none is set
    if (!mainImageId && updatedImages.length > 0) {
      setMainImageId(updatedImages[0].id)
    }
  }

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id)
    setImages(updatedImages)

    if (mainImageId === id && updatedImages.length > 0) {
      setMainImageId(updatedImages[0].id)
    }
  }

  const setAsMainImage = (id: string) => {
    setMainImageId(id)
  }

  const updateDescription = (id: string, description: string) => {
    setImages(images.map(img =>
      img.id === id ? { ...img, description } : img
    ))
  }

  const handleContinue = () => {
    if (images.length < 2) {
      alert('Du må laste opp minst 2 bilder')
      return
    }

    const finalImages = images.map(img => ({
      ...img,
      type: img.id === mainImageId ? 'main' as const : 'element' as const,
    }))

    onImagesUploaded(finalImages)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-4">Last opp bilder (2-6 stk)</h2>
      <p className="text-gray-600 mb-6">
        Last opp et hovedbilde av kjøkkenet ditt, og deretter bilder av steinbenkeplater,
        kokeplate, ovn, kaffemaskin eller andre elementer du ønsker å legge til.
      </p>

      {/* Upload area */}
      <div className="mb-6">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Klikk for å laste opp</span> eller dra og slipp
            </p>
            <p className="text-xs text-gray-500">PNG, JPG (maks 6 bilder)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={images.length >= 6}
          />
        </label>
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {images.map(img => (
            <div
              key={img.id}
              className={`relative border-2 rounded-lg overflow-hidden ${
                img.id === mainImageId ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <img
                src={img.preview}
                alt="Preview"
                className="w-full h-48 object-cover"
              />

              {/* Badge */}
              {img.id === mainImageId && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Hovedbilde
                </div>
              )}

              {/* Actions */}
              <div className="absolute top-2 right-2 flex space-x-1">
                {img.id !== mainImageId && (
                  <button
                    onClick={() => setAsMainImage(img.id)}
                    className="bg-white/90 hover:bg-white p-1 rounded"
                    title="Sett som hovedbilde"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => removeImage(img.id)}
                  className="bg-red-500/90 hover:bg-red-500 text-white p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Description input */}
              <div className="p-2 bg-gray-50">
                <input
                  type="text"
                  placeholder="Beskrivelse (f.eks. 'steinbenkeplate', 'kaffemaskin')..."
                  className="w-full text-sm px-2 py-1 border border-gray-300 rounded"
                  value={img.description || ''}
                  onChange={(e) => updateDescription(img.id, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Continue button */}
      {images.length >= 2 && (
        <button
          onClick={handleContinue}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Fortsett til komposisjon ({images.length} bilder)
        </button>
      )}

      {images.length === 1 && (
        <p className="text-center text-sm text-gray-500">
          Last opp minst ett bilde til for å fortsette
        </p>
      )}
    </div>
  )
}
