const geocodeCache = new Map<string, [number, number]>();
const DEFAULT_COORDS: [number, number] = [1.3521, 103.8198]; // Singapore center

let lastRequestTime = 0;
const REQUEST_DELAY = 50;

async function geocodeSingaporeAddress(address: string): Promise<[number, number]> {

  const cacheKey = address.toLowerCase().trim();
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  const now = Date.now();
  const delay = Math.max(0, REQUEST_DELAY - (now - lastRequestTime));
  await new Promise(resolve => setTimeout(resolve, delay));
  lastRequestTime = Date.now();

  try {
    const response = await fetch(
      `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(address)}&returnGeom=Y&getAddrDetails=Y`
    );

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const data = await response.json();
    if (data.results?.length > 0) {
      const coords: [number, number] = [
        parseFloat(data.results[0].LATITUDE),
        parseFloat(data.results[0].LONGITUDE)
      ];
      geocodeCache.set(cacheKey, coords);
      return coords;
    }

    return DEFAULT_COORDS;
  } catch (error) {
    console.error('Geocoding failed:', error);
    return DEFAULT_COORDS;
  }
}

export { geocodeSingaporeAddress };