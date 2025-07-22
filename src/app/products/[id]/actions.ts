
"use server";

import Razorpay from "razorpay";

export async function createRazorpayOrder(amount: number, orderId: string) {
  const instance = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: `receipt_order_${orderId}`,
  };

  try {
    const order = await instance.orders.create(options);
    if (!order) {
      throw new Error("Failed to create order");
    }
    return order;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create Razorpay order");
  }
}
