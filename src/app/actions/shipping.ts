
'use server';

import { z } from 'zod';

const getDelhiveryToken = () => {
  const token = process.env.DELHIVERY_API_KEY;
  if (!token) {
    throw new Error('Delhivery API key is not configured.');
  }
  return token;
};

const serviceabilitySchema = z.object({
  delivery_postcode: z.string().min(6).max(6),
  weight: z.number().positive(),
  subtotal: z.number().positive(),
});

export async function getShippingRates(input: z.infer<typeof serviceabilitySchema>) {
  try {
    const validatedInput = serviceabilitySchema.parse(input);
    const token = getDelhiveryToken();
    const pickupPincode = "442401"; 

    // Note: Delhivery API expects weight in kilograms.
    const weightInKg = validatedInput.weight; 

    const queryParams = new URLSearchParams({
      md: 'S', // Surface shipping mode
      ss: 'DTO', // Shipping strategy
      d_pin: validatedInput.delivery_postcode,
      o_pin: pickupPincode,
      cgm: weightInKg.toString(),
      pt: 'Pre-paid',
      cod_amount: validatedInput.cod === '1' ? validatedInput.subtotal.toString() : '0',
    });

    const res = await fetch(`https://track.delhivery.com/api/kinko/v1/invoice/charges.json?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
    });

    const data = await res.json();
    
    if (!res.ok || !data || data.length === 0) {
       return { success: false, message: "No couriers available for this pincode.", options: [] };
    }
    
    const firstOption = data[0];
    const option = {
      name: 'Delhivery Surface',
      rate: firstOption.total_amount,
      estimated_delivery_days: firstOption.etd,
    };

    return { success: true, options: [option] };

  } catch (error) {
    console.error("Error fetching Delhivery shipping rates:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to fetch shipping rates. ${errorMessage}`, options: [] };
  }
}
