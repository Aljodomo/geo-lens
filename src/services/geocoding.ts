export interface GeocodeResult {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  extent?: [number, number, number, number];
}

export async function searchLocations(query: string): Promise<GeocodeResult[]> {
  const sanitized = query.trim().slice(0, 100).replace(/[\x00-\x1F\x7F]/g, '');
  if (sanitized.length < 2) return [];

  const coordMatch = sanitized.match(/^([-+]?\d{1,2}(?:\.\d+)?),\s*([-+]?\d{1,3}(?:\.\d+)?)$/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return [
        {
          id: `coord-${lat}-${lng}`,
          name: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          country: 'Target Location',
          lat,
          lng,
        },
      ];
    }
  }

  try {
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6`
    );
    if (!response.ok) throw new Error('Geocoding search failed');
    const data = await response.json();

    return (data.features || []).map((f: any, idx: number) => {
      const p = f.properties;
      const [lng, lat] = f.geometry.coordinates;
      const label = [p.name, p.city || p.district, p.state, p.country]
        .filter(Boolean)
        .join(', ');

      return {
        id: `${p.osm_id || idx}-${lat}-${lng}`,
        name: label || p.name || 'Unknown Location',
        country: p.country || '',
        lat,
        lng,
        extent: p.extent,
      };
    });
  } catch (err) {
    console.warn('Geocoding fallback:', err);
    return [];
  }
}
