
'use server';

export async function getAddressFromCoordinates(lat: number, lng: number) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error('Google Maps API key is not configured.');
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Geocoding API error: ${data.status} - ${data.error_message || ''}`);
    }

    const result = data.results[0];
    if (!result) {
      return { success: false, message: 'No address found for these coordinates.' };
    }

    const addressComponents = result.address_components;
    
    const getComponent = (type: string) => addressComponents.find((c: any) => c.types.includes(type))?.long_name || '';

    const streetNumber = getComponent('street_number');
    const route = getComponent('route');
    const sublocality = getComponent('sublocality_level_1');

    const street = [streetNumber, route].filter(Boolean).join(' ');
    const city = getComponent('locality') || getComponent('administrative_area_level_2');
    const state = getComponent('administrative_area_level_1');
    const pincode = getComponent('postal_code');
    const country = getComponent('country');

    return {
      success: true,
      address: {
        street: street || sublocality,
        city,
        state,
        pincode,
        country
      },
    };
  } catch (error) {
    console.error('Error fetching address:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to fetch address. ${errorMessage}` };
  }
}
