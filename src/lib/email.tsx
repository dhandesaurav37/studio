
'use server';

import React from 'react';
import { Resend } from 'resend';
import { Product } from './data';
import { UserOrder } from '@/hooks/use-store';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'onboarding@resend.dev'; // Replace with your verified domain email in production

// Base Template Component
const EmailBaseTemplate = ({ previewText, children }: { previewText: string, children: React.ReactNode }) => (
  <html lang="en">
    <head>
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <style>{`
        body { margin: 0; padding: 0; font-family: sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; }
        .header { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        .content { font-size: 16px; line-height: 1.5; color: #333; }
        .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #888; }
      `}</style>
    </head>
    <body>
      <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden' }}>{previewText}</div>
      <div className="container">
        <div className="header">White Wolf</div>
        <div className="content">{children}</div>
        <div className="footer">
          <p>&copy; {new Date().getFullYear()} White Wolf Co. All Rights Reserved.</p>
        </div>
      </div>
    </body>
  </html>
);

// Individual Email Templates
const WelcomeEmail = ({ name }: { name: string }) => (
  <EmailBaseTemplate previewText={`Welcome to the pack, ${name}!`}>
    <h1>Welcome to the Pack, {name}!</h1>
    <p>Thank you for joining White Wolf. We're excited to have you with us.</p>
    <p>Explore our latest collections and define your style.</p>
    <a href="https://thewhitewolf.shop/products">Shop Now</a>
  </EmailBaseTemplate>
);

const OrderConfirmationEmail = ({ order }: { order: UserOrder & { customerName: string } }) => (
  <EmailBaseTemplate previewText={`Your White Wolf Order #${order.id.slice(-6).toUpperCase()} is Confirmed!`}>
    <h1>Order Confirmed!</h1>
    <p>Hi {order.customerName},</p>
    <p>Thanks for your order. We'll let you know once it has shipped. Here are the details:</p>
    <p><strong>Order ID:</strong> #{order.id.slice(-6).toUpperCase()}</p>
    <p><strong>Total:</strong> ₹{order.total.toFixed(2)}</p>
    <p>You can view your order details here: <a href={`https://thewhitewolf.shop/orders`}>My Orders</a></p>
  </EmailBaseTemplate>
);

const OrderShippedEmail = ({ order }: { order: UserOrder & { customerName: string } }) => (
  <EmailBaseTemplate previewText={`Your White Wolf Order #${order.id.slice(-6).toUpperCase()} has shipped!`}>
    <h1>Your Order is on its Way!</h1>
    <p>Hi {order.customerName}, good news! Your order has been shipped.</p>
    <p><strong>Order ID:</strong> #{order.id.slice(-6).toUpperCase()}</p>
    <p>You can view your order status here: <a href={`https://thewhitewolf.shop/orders`}>My Orders</a></p>
  </EmailBaseTemplate>
);

const OrderDeliveredEmail = ({ order }: { order: UserOrder & { customerName: string } }) => (
  <EmailBaseTemplate previewText={`Your White Wolf Order #${order.id.slice(-6).toUpperCase()} has been delivered!`}>
    <h1>Your Order Has Arrived!</h1>
    <p>Hi {order.customerName},</p>
    <p>Your order has been delivered. We hope you love your new gear!</p>
    <p><strong>Order ID:</strong> #{order.id.slice(-6).toUpperCase()}</p>
    <p>Thanks for shopping with us. <a href={`https://thewhitewolf.shop/faq`}>Leave a review</a></p>
  </EmailBaseTemplate>
);

const ReturnStatusEmail = ({ order, statusMessage }: { order: UserOrder & { customerName: string }, statusMessage: string }) => (
  <EmailBaseTemplate previewText={`Update on your return for order #${order.id.slice(-6).toUpperCase()}`}>
    <h1>Return Status Update</h1>
    <p>Hi {order.customerName},</p>
    <p>There's an update on your return request for order #{order.id.slice(-6).toUpperCase()}.</p>
    <p><strong>Status:</strong> {statusMessage}</p>
    <p>You can view your order details here: <a href={`https://thewhitewolf.shop/orders`}>My Orders</a></p>
  </EmailBaseTemplate>
);

const EMAIL_TEMPLATES = {
  welcome: WelcomeEmail,
  orderConfirmation: OrderConfirmationEmail,
  orderShipped: OrderShippedEmail,
  orderDelivered: OrderDeliveredEmail,
  returnStatus: ReturnStatusEmail,
};

export type EmailTemplateName = keyof typeof EMAIL_TEMPLATES;

export interface EmailTemplateProps {
  to: string;
  subject: string;
  templateName: EmailTemplateName;
  props: any;
}

export const sendEmail = async ({ to, subject, templateName, props }: EmailTemplateProps) => {
  const TemplateComponent = EMAIL_TEMPLATES[templateName];
  if (!TemplateComponent) {
    throw new Error(`Email template "${templateName}" not found.`);
  }

  const reactNode = React.createElement(TemplateComponent, props);
  
  // This is where the actual email sending logic would go.
  // For now, we will log to the console to simulate sending.
  console.log('--- SIMULATING EMAIL ---');
  console.log('To:', to);
  console.log('From:', FROM_EMAIL);
  console.log('Subject:', subject);
  console.log('Template:', templateName);
  console.log('Props:', props);
  console.log('--- END SIMULATION ---');

  // To enable actual sending with Resend, you would uncomment the following lines
  // and make sure your RESEND_API_KEY is set in your environment variables.
  /*
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: subject,
      react: reactNode,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Failed to send email via Resend.");
    }
    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in sendEmail function:", error);
    throw error;
  }
  */
};
