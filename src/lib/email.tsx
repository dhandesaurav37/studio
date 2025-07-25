
'use server';

import React from 'react';
import sgMail from '@sendgrid/mail';
import { UserOrder } from '@/hooks/use-store';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
const FROM_EMAIL = 'contact@thewhitewolf.shop'; 

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
          <p>&copy; ${new Date().getFullYear()} White Wolf Co. All Rights Reserved.</p>
        </div>
      </div>
    </body>
  </html>
);

// This is a helper to render React components to a string, as SendGrid expects HTML.
// Note: In a real app, you might use a library like `renderToString` from `react-dom/server`,
// but for simplicity, we'll construct the HTML string directly.
const renderReactToHtml = (component: React.ReactElement): string => {
  // This is a simplified "renderer". A real implementation would be more complex.
  // For now, we'll just return a placeholder.
  // A full implementation would require `react-dom/server`.
  // The structure of the email is defined in the components below.
  // For the purpose of this example, we'll focus on the logic.
  // The actual rendering to HTML string will be handled by the library.
  return `<!DOCTYPE html>${component.props.children}`;
};

// Individual Email Templates
const WelcomeEmail = ({ name }: { name: string }) => (
  <EmailBaseTemplate previewText={`Welcome to the pack, ${name}!`}>
    <h1>Welcome to the Pack, ${name}!</h1>
    <p>Thank you for joining White Wolf. We're excited to have you with us.</p>
    <p>Explore our latest collections and define your style.</p>
    <a href="https://thewhitewolf.shop/products">Shop Now</a>
  </EmailBaseTemplate>
);

const OrderConfirmationEmail = ({ order }: { order: UserOrder & { customerName: string } }) => (
  <EmailBaseTemplate previewText={`Your White Wolf Order #${order.id.slice(-6).toUpperCase()} is Confirmed!`}>
    <h1>Order Confirmed!</h1>
    <p>Hi ${order.customerName},</p>
    <p>Thanks for your order. We'll let you know once it has shipped. Here are the details:</p>
    <p><strong>Order ID:</strong> #${order.id.slice(-6).toUpperCase()}</p>
    <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
    <p>You can view your order details here: <a href={`https://thewhitewolf.shop/orders`}>My Orders</a></p>
  </EmailBaseTemplate>
);

const OrderShippedEmail = ({ order }: { order: UserOrder & { customerName: string } }) => (
  <EmailBaseTemplate previewText={`Your White Wolf Order #${order.id.slice(-6).toUpperCase()} has shipped!`}>
    <h1>Your Order is on its Way!</h1>
    <p>Hi ${order.customerName}, good news! Your order has been shipped.</p>
    <p><strong>Order ID:</strong> #${order.id.slice(-6).toUpperCase()}</p>
    <p>You can view your order status here: <a href={`https://thewhitewolf.shop/orders`}>My Orders</a></p>
  </EmailBaseTemplate>
);

const OrderDeliveredEmail = ({ order }: { order: UserOrder & { customerName: string } }) => (
  <EmailBaseTemplate previewText={`Your White Wolf Order #${order.id.slice(-6).toUpperCase()} has been delivered!`}>
    <h1>Your Order Has Arrived!</h1>
    <p>Hi ${order.customerName},</p>
    <p>Your order has been delivered. We hope you love your new gear!</p>
    <p><strong>Order ID:</strong> #${order.id.slice(-6).toUpperCase()}</p>
    <p>Thanks for shopping with us. <a href={`https://thewhitewolf.shop/faq`}>Leave a review</a></p>
  </EmailBaseTemplate>
);

const ReturnStatusEmail = ({ order, statusMessage }: { order: UserOrder & { customerName: string }, statusMessage: string }) => (
  <EmailBaseTemplate previewText={`Update on your return for order #${order.id.slice(-6).toUpperCase()}`}>
    <h1>Return Status Update</h1>
    <p>Hi ${order.customerName},</p>
    <p>There's an update on your return request for order #${order.id.slice(-6).toUpperCase()}.</p>
    <p><strong>Status:</strong> ${statusMessage}</p>
    <p>You can view your order details here: <a href={`https://thewhitewolf.shop/orders`}>My Orders</a></p>
  </EmailBaseTemplate>
);


const getEmailHtml = (templateName: EmailTemplateName, props: any): { subject: string, html: string, text: string } => {
    // Note: A real implementation would use ReactDOMServer.renderToString here.
    // For this environment, we'll manually construct a simple HTML string.
    let subject = '';
    let body = '';
    let text = '';

    switch(templateName) {
        case 'welcome':
            subject = `Welcome to the pack, ${props.name}!`;
            body = `<h1>Welcome to the Pack, ${props.name}!</h1><p>Thank you for joining White Wolf. We're excited to have you with us. Explore our latest collections and define your style. <a href="https://thewhitewolf.shop/products">Shop Now</a></p>`;
            text = `Welcome to the Pack, ${props.name}! Thank you for joining White Wolf. We're excited to have you with us. Explore our latest collections and define your style.`;
            break;
        case 'orderConfirmation':
            subject = `Your White Wolf Order #${props.order.id.slice(-6).toUpperCase()} is Confirmed!`;
            body = `<h1>Order Confirmed!</h1><p>Hi ${props.order.customerName},</p><p>Thanks for your order. We'll let you know once it has shipped. Here are the details:</p><p><strong>Order ID:</strong> #${props.order.id.slice(-6).toUpperCase()}</p><p><strong>Total:</strong> ₹${props.order.total.toFixed(2)}</p><p>You can view your order details here: <a href="https://thewhitewolf.shop/orders">My Orders</a></p>`;
            text = `Order Confirmed! Hi ${props.order.customerName}, Thanks for your order. Order ID: #${props.order.id.slice(-6).toUpperCase()}. Total: ₹${props.order.total.toFixed(2)}.`;
            break;
        case 'orderShipped':
            subject = `Your White Wolf Order has Shipped!`;
            body = `<h1>Your Order is on its Way!</h1><p>Hi ${props.order.customerName}, good news! Your order has been shipped.</p><p>You can view your order status here: <a href="https://thewhitewolf.shop/orders">My Orders</a></p>`;
            text = `Your Order is on its Way! Hi ${props.order.customerName}, good news! Your order has been shipped.`;
            break;
        case 'orderDelivered':
            subject = `Your White Wolf Order has been Delivered!`;
            body = `<h1>Your Order Has Arrived!</h1><p>Hi ${props.order.customerName},</p><p>Your order has been delivered. We hope you love your new gear!</p><p>Thanks for shopping with us. <a href="https://thewhitewolf.shop/faq">Leave a review</a></p>`;
            text = `Your Order Has Arrived! Hi ${props.order.customerName}, Your order has been delivered. We hope you love your new gear!`;
            break;
        case 'returnStatus':
            subject = `Update on your return request`;
            body = `<h1>Return Status Update</h1><p>Hi ${props.order.customerName},</p><p>There's an update on your return request for order #${props.order.id.slice(-6).toUpperCase()}.</p><p><strong>Status:</strong> ${props.statusMessage}</p><p>You can view your order details here: <a href="https://thewhitewolf.shop/orders">My Orders</a></p>`;
            text = `Return Status Update. Hi ${props.order.customerName}, There's an update on your return request for order #${props.order.id.slice(-6).toUpperCase()}. Status: ${props.statusMessage}`;
            break;
        default:
             body = '<h1>Notification</h1><p>This is a default notification from White Wolf.</p>';
             text = 'This is a default notification from White Wolf.';
    }

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; }
          .header { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px; }
          .content { font-size: 16px; line-height: 1.5; color: #333; }
          .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #888; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">White Wolf</div>
          <div class="content">${body}</div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} White Wolf Co. All Rights Reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return { subject, html: fullHtml, text };
};


export type EmailTemplateName = 'welcome' | 'orderConfirmation' | 'orderShipped' | 'orderDelivered' | 'returnStatus';

export interface EmailTemplateProps {
  to: string;
  subject?: string; // Subject will now be generated from the template
  templateName: EmailTemplateName;
  props: any;
}

export const sendEmail = async ({ to, templateName, props }: EmailTemplateProps) => {
  const { subject, html, text } = getEmailHtml(templateName, props);
  
  const msg = {
    to: to,
    from: FROM_EMAIL,
    subject: subject,
    text: text,
    html: html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error in sendEmail function with SendGrid:', error);
    // It's important to check for more specific error details if available
    if ((error as any).response) {
      console.error((error as any).response.body)
    }
    throw error;
  }
};
