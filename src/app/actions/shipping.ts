
'use server';

import { z } from 'zod';

const shiprocketAuthResponseSchema = z.object({
  token: z.string(),
});

const getShiprocketToken = async () => {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error('Shiprocket credentials are not configured.');
  }

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  const parsed = shiprocketAuthResponseSchema.safeParse(data);

  if (!parsed.success) {
    console.error("Shiprocket auth error:", parsed.error);
    throw new Error('Failed to authenticate with Shiprocket.');
  }

  return parsed.data.token;
};

const serviceabilitySchema = z.object({
  delivery_postcode: z.string().min(6).max(6),
  weight: z.number().positive(),
  cod: z.enum(['0', '1']),
  subtotal: z.number().positive(),
});

export async function getShippingRates(input: z.infer<typeof serviceabilitySchema>) {
  try {
    const validatedInput = serviceabilitySchema.parse(input);
    const token = await getShiprocketToken();
    const pickupPincode = "442401"; // Replace with your actual pickup pincode or make it dynamic

    const queryParams = new URLSearchParams({
      pickup_postcode: pickupPincode,
      delivery_postcode: validatedInput.delivery_postcode,
      cod: validatedInput.cod,
      weight: validatedInput.weight.toString(),
      declared_value: validatedInput.subtotal.toString(),
    });
    
    const res = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await res.json();
    
    if (data.status !== 200 || !data.data?.available_courier_companies) {
       return { success: false, message: data.message || "No couriers available for this pincode.", options: [] };
    }
    
    const availableOptions = data.data.available_courier_companies;

    const options = availableOptions.map((courier: any) => ({
      name: courier.courier_name,
      rate: courier.rate,
      estimated_delivery_days: courier.etd,
    })).sort((a: any, b: any) => a.rate - b.rate);

    return { success: true, options };

  } catch (error) {
    console.error("Error fetching shipping rates:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to fetch shipping rates. ${errorMessage}`, options: [] };
  }
}

