/**
 * Geocodes an address or pincode using the free OpenStreetMap Nominatim API.
 * Nominatim usage policy: Max 1 request per second.
 */
export async function geocodeLocation(addressOrPincode: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // Adding 'Ahmedabad, Gujarat, India' helps scope the results primarily for this app
    const query = encodeURIComponent(`${addressOrPincode}, Ahmedabad, Gujarat, India`);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
      headers: {
        'User-Agent': 'ICAI-Ahmedabad-CarPool-App/1.0', // Important for Nominatim policy
      },
    });

    if (!response.ok) {
      console.error('Failed to geocode location', response.statusText);
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon), // Note Nominatim uses 'lon'
      };
    }

    return null;
  } catch (error) {
    console.error('Error during geocoding:', error);
    return null;
  }
}
