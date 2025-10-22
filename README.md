# Kitchen Image Composer

En AI-drevet web-applikasjon for å komponere kjøkkenbilder ved å kombinere et hovedbilde med steinbenkeplater, apparater og andre elementer.

## Funksjoner

- Last opp 2-6 bilder (ett hovedbilde + elementer)
- Bruk AI til å komponere bildene sammen
- Iterer på resultatet med kommentarer og forbedringer
- Versjonshistorikk for alle genererte bilder
- Last ned høyoppløselige versjoner av godkjente bilder

## Teknologi

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **AI**: Google Gemini API (Gemini 1.5 Pro med bildeanalyse)
- **Ikon**: Lucide React

## Oppsett

### 1. Installer avhengigheter

```bash
npm install
```

### 2. Konfigurer Google Gemini API

1. Gå til [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Opprett en API-nøkkel
3. Kopier `.env.example` til `.env`:

```bash
cp .env.example .env
```

4. Legg til din API-nøkkel i `.env`:

```
GOOGLE_GEMINI_API_KEY=din_api_nøkkel_her
```

### 3. Kjør utviklingsserver

```bash
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren.

## Bruk

### Steg 1: Last opp bilder

1. Klikk på opplastingsområdet eller dra og slipp bilder
2. Last opp 2-6 bilder:
   - Ett hovedbilde av kjøkkenet
   - Bilder av steinbenkeplater, apparater, etc.
3. Velg hvilket bilde som skal være hovedbildet
4. Legg til beskrivelser for hvert bilde (valgfritt, men anbefalt)

### Steg 2: Komponér bilder

1. Beskriv hva du ønsker å gjøre (f.eks. "Plasser steinbenkeplaten på kjøkkenbenken og legg til kaffemaskinen på venstre side")
2. Legg til en kommentar om du har spesifikke ønsker
3. Klikk "Generer bilde"
4. Vent mens AI-en komponerer bildene

### Steg 3: Iterer og godkjenn

1. Se på det genererte bildet
2. Hvis du vil gjøre endringer:
   - Skriv ny instruksjon
   - Generer nytt bilde
   - Alle versjoner lagres i historikken
3. Når du er fornøyd, klikk "Godkjenn"

### Steg 4: Last ned

1. Last ned høyoppløselig versjon av det godkjente bildet
2. Bruk bildet på nettsiden din

## Viktige merknader

### Bildegenerering

Denne applikasjonen bruker for øyeblikket Google Gemini API for bildeanalyse og beskrivelser. For faktisk bildekomposisjon og -redigering, vil du trenge å integrere en av følgende tjenester:

1. **Google Imagen 3** (anbefalt, men begrenset API-tilgang)
   - Beste kvalitet for bilderedigering
   - Krever særskilt tilgang

2. **Stable Diffusion med inpainting**
   - Open source alternativ
   - Kan kjøres lokalt eller via API

3. **DALL-E 3 API**
   - OpenAI's bildegenereringstjeneste
   - God kvalitet, men kostbart

4. **Canvas/Sharp for enkel komposisjon**
   - Grunnleggende bildekomposisjon
   - Ingen AI, men rask og pålitelig

### Produksjonstips

- Bruk en dedikert bildebehandlingstjeneste
- Implementer rate limiting på API-endepunktene
- Legg til bildeoptimalisering før nedlasting
- Vurder å lagre genererte bilder i cloud storage (AWS S3, Google Cloud Storage)
- Legg til autentisering hvis applikasjonen skal brukes av flere

## Struktur

```
/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # API-endepunkt for bildegenerering
│   ├── layout.tsx                # Hovedlayout
│   ├── page.tsx                  # Hovedside med workflow
│   └── globals.css               # Globale stiler
├── components/
│   ├── ImageUploader.tsx         # Komponent for bildeopplasting
│   ├── ImageComposer.tsx         # Komponent for bildekomposisjon
│   └── VersionHistory.tsx        # Komponent for versjonshistorikk
├── .env.example                  # Eksempel på miljøvariabler
└── README.md                     # Denne filen
```

## Utvikling

### Legg til nye funksjoner

- **Forhåndsvisning**: Vis forhåndsvisning av hvordan elementer vil plasseres
- **Masker**: La brukere tegne masker for hvor elementer skal plasseres
- **Stilalternativer**: Legg til ulike stiler (moderne, klassisk, minimalistisk)
- **Batch-behandling**: Generer flere varianter samtidig

### Testing

```bash
npm run build
```

## Lisens

MIT

## Support

For spørsmål eller problemer, opprett en issue i GitHub-repositoriet.
