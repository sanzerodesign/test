import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const prompt = formData.get('prompt') as string

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt er påkrevd' },
        { status: 400 }
      )
    }

    // Extract images from form data
    const images: { data: Buffer; type: string; description: string }[] = []
    let mainImageIndex = -1

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image_') && !key.includes('_type') && !key.includes('_description')) {
        const index = key.split('_')[1]
        const file = value as File
        const type = formData.get(`image_${index}_type`) as string
        const description = formData.get(`image_${index}_description`) as string

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        images.push({ data: buffer, type, description })

        if (type === 'main') {
          mainImageIndex = images.length - 1
        }
      }
    }

    if (images.length < 2) {
      return NextResponse.json(
        { error: 'Minst 2 bilder er påkrevd' },
        { status: 400 }
      )
    }

    // Convert images to base64 for Gemini API
    const imageParts = images.map((img, idx) => ({
      inlineData: {
        data: img.data.toString('base64'),
        mimeType: 'image/jpeg',
      },
    }))

    // Build comprehensive prompt
    const mainImageDesc = mainImageIndex >= 0 ? images[mainImageIndex].description : 'kjøkken'
    const elementDescs = images
      .filter((img, idx) => img.type === 'element')
      .map(img => img.description)
      .filter(desc => desc)
      .join(', ')

    const fullPrompt = `Du er en ekspert på bildekomposisjon og bilderedigering for interiørdesign.

OPPGAVE: ${prompt}

KONTEKST:
- Hovedbilde: ${mainImageDesc}
- Elementer som skal legges til: ${elementDescs}
- Antall bilder: ${images.length}

INSTRUKSJONER:
1. Analyser hovedbildet (det første bildet) som er basen for komposisjonen
2. Identifiser hvor elementene skal plasseres basert på brukerens instruksjoner
3. Integrer elementene naturlig inn i hovedbildet med realistisk belysning, perspektiv og skygger
4. Sørg for at steinbenkeplater, apparater og andre elementer ser naturlige ut i konteksten
5. Behold kvaliteten og oppløsningen til hovedbildet
6. Gjør overgangene mellom hovedbilde og nye elementer så sømløse som mulig

Generer en detaljert beskrivelse av hvordan det ferdige bildet skal se ut, med fokus på:
- Plassering av hvert element
- Belysning og skygger
- Perspektiv og proporsjoner
- Farger og teksturer som skal matches

Beskriv det endelige bildet i detalj på norsk.`

    // Use Gemini to analyze and generate description
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

    const result = await model.generateContent([
      fullPrompt,
      ...imageParts,
    ])

    const response = await result.response
    const description = response.text()

    // For now, we'll return a simulated result since actual image generation
    // requires Imagen 3 which has limited API access
    // In production, you would use Google's Imagen 3 API or similar service

    // Create a composite image URL (this would be the actual generated image)
    // For demonstration, we'll return a data URL with a placeholder
    const compositeImageUrl = await createCompositeImage(images)

    return NextResponse.json({
      imageUrl: compositeImageUrl,
      description: description,
      success: true,
    })
  } catch (error) {
    console.error('Error in generate API:', error)
    return NextResponse.json(
      {
        error: 'En feil oppstod under generering',
        details: error instanceof Error ? error.message : 'Ukjent feil',
      },
      { status: 500 }
    )
  }
}

// Helper function to create a composite image
// In a production environment, this would call an actual image generation service
async function createCompositeImage(
  images: { data: Buffer; type: string; description: string }[]
): Promise<string> {
  // For demonstration purposes, we'll return the main image
  // In production, this would integrate with:
  // 1. Google Imagen 3 API (when available)
  // 2. Stable Diffusion with inpainting
  // 3. DALL-E 3 with image editing
  // 4. Custom image composition using Canvas/Sharp

  const mainImage = images.find(img => img.type === 'main')
  if (mainImage) {
    const base64 = mainImage.data.toString('base64')
    return `data:image/jpeg;base64,${base64}`
  }

  // Fallback
  return `data:image/jpeg;base64,${images[0].data.toString('base64')}`
}
