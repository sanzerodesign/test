'use client'

import { useState } from 'react'
import ImageUploader from '@/components/ImageUploader'
import ImageComposer from '@/components/ImageComposer'
import VersionHistory from '@/components/VersionHistory'

export type UploadedImage = {
  id: string
  file: File
  preview: string
  type: 'main' | 'element'
  description?: string
}

export type ImageVersion = {
  id: string
  imageUrl: string
  prompt: string
  comment?: string
  timestamp: Date
  approved: boolean
}

export default function Home() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [currentStep, setCurrentStep] = useState<'upload' | 'compose' | 'review'>('upload')
  const [versions, setVersions] = useState<ImageVersion[]>([])
  const [currentVersion, setCurrentVersion] = useState<ImageVersion | null>(null)

  const handleImagesUploaded = (uploadedImages: UploadedImage[]) => {
    setImages(uploadedImages)
    setCurrentStep('compose')
  }

  const handleGenerateImage = (version: ImageVersion) => {
    setVersions([...versions, version])
    setCurrentVersion(version)
  }

  const handleApproveVersion = (versionId: string) => {
    const updatedVersions = versions.map(v =>
      v.id === versionId ? { ...v, approved: true } : v
    )
    setVersions(updatedVersions)
    setCurrentStep('review')
  }

  const handleStartOver = () => {
    setImages([])
    setVersions([])
    setCurrentVersion(null)
    setCurrentStep('upload')
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Kitchen Image Composer
          </h1>
          <p className="text-gray-600">
            Komponér kjøkkenbilder med AI - kombiner hovedbilde med steinbenkeplate og apparater
          </p>
        </header>

        {/* Progress indicator */}
        <div className="mb-8 flex items-center justify-center space-x-4">
          <div className={`flex items-center ${currentStep === 'upload' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'upload' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
              1
            </div>
            <span className="ml-2 font-medium">Last opp bilder</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center ${currentStep === 'compose' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'compose' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
              2
            </div>
            <span className="ml-2 font-medium">Komponér</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center ${currentStep === 'review' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'review' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
              3
            </div>
            <span className="ml-2 font-medium">Last ned</span>
          </div>
        </div>

        {currentStep === 'upload' && (
          <ImageUploader onImagesUploaded={handleImagesUploaded} />
        )}

        {currentStep === 'compose' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ImageComposer
                images={images}
                onGenerateImage={handleGenerateImage}
                onApproveVersion={handleApproveVersion}
                currentVersion={currentVersion}
              />
            </div>
            <div>
              <VersionHistory
                versions={versions}
                onSelectVersion={setCurrentVersion}
                currentVersion={currentVersion}
              />
            </div>
          </div>
        )}

        {currentStep === 'review' && currentVersion && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Ferdig! Last ned bildet ditt</h2>
            <div className="mb-6">
              <img
                src={currentVersion.imageUrl}
                alt="Final composition"
                className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <a
                href={currentVersion.imageUrl}
                download="kitchen-composition.png"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Last ned høyoppløselig bilde
              </a>
              <button
                onClick={handleStartOver}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Start på nytt
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
