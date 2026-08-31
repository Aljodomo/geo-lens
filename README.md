> **Notice:** This project was **vibe coded**.

# GeoLens

In-browser satellite Earth observation and zero-shot AI object detection. Type any natural language prompt to detect, segment, and georeference targets over live ESRI satellite imagery entirely client-side.

## Features

- **Client-Side Zero-Shot Vision**: Runs `Xenova/clipseg-rd64-refined` via WebAssembly (WASM) in a dedicated Web Worker.
- **Satellite Basemap**: High-resolution ESRI World Imagery with Carto labels powered by MapLibre GL.
- **Real-Time GeoReferencing**: Projects pixel detections into georeferenced GeoJSON polygon overlays using Turf.js.
- **Global Search & Fly-To**: Fast location search and teleportation powered by OpenStreetMap Nominatim.

## Tech Stack

- **Frontend & Mapping**: React 19, TypeScript, Tailwind CSS v4, MapLibre GL JS, Turf.js
- **In-Browser ML**: `@huggingface/transformers` (WASM / Web Worker)
- **Tooling**: Vite, Oxlint

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## License

MIT
