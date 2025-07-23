
'use server';

// This file is temporarily disabled as per user request.
// A fixed shipping rate is being used throughout the application.

export async function getShippingRates() {
    // A fixed rate is being used.
    return { success: true, options: [{ name: 'Standard Shipping', rate: 100, estimated_delivery_days: '5-7' }] };
}
