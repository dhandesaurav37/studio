
'use server';

import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn("SENDGRID_API_KEY is not set. Emails will not be sent.");
}
const FROM_EMAIL = 'noreply@thewhitewolf.shop'; 

const getEmailHtml = (templateName: EmailTemplateName, props: any): { subject: string, html: string, text: string } => {
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
            subject = `Your White Wolf Order #${props.order.id.slice(-6).toUpperCase()} has Shipped!`;
            body = `<h1>Your Order is on its Way!</h1><p>Hi ${props.order.customerName}, good news! Your order #${props.order.id.slice(-6).toUpperCase()} has been shipped.</p><p>You can view your order status here: <a href="https://thewhitewolf.shop/orders">My Orders</a></p>`;
            text = `Your Order is on its Way! Hi ${props.order.customerName}, good news! Your order #${props.order.id.slice(-6).toUpperCase()} has been shipped.`;
            break;
        case 'orderDelivered':
            subject = `Your White Wolf Order #${props.order.id.slice(-6).toUpperCase()} has been Delivered!`;
            body = `<h1>Your Order Has Arrived!</h1><p>Hi ${props.order.customerName},</p><p>Your order #${props.order.id.slice(-6).toUpperCase()} has been delivered. We hope you love your new gear!</p><p>Thanks for shopping with us. <a href="https://thewhitewolf.shop/faq">Leave a review</a></p>`;
            text = `Your Order Has Arrived! Hi ${props.order.customerName}, Your order #${props.order.id.slice(-6).toUpperCase()} has been delivered. We hope you love your new gear!`;
            break;
        case 'orderCancelled':
            subject = `Your White Wolf Order #${props.order.id.slice(-6).toUpperCase()} has been cancelled`;
            body = `<h1>Order Cancelled</h1><p>Hi ${props.order.customerName},</p><p>Your order #${props.order.id.slice(-6).toUpperCase()} has been successfully cancelled. If you have any questions, please contact our support team.</p>`;
            text = `Order Cancelled. Hi ${props.order.customerName}, your order #${props.order.id.slice(-6).toUpperCase()} has been successfully cancelled.`;
            break;
        case 'returnRequested':
            subject = `We've received your return request for Order #${props.order.id.slice(-6).toUpperCase()}`;
            body = `<h1>Return Request Received</h1><p>Hi ${props.order.customerName},</p><p>We have received your return request for order #${props.order.id.slice(-6).toUpperCase()}. We will review it shortly and get back to you with the next steps.</p><p>You can view your order details here: <a href="https://thewhitewolf.shop/orders">My Orders</a></p>`;
            text = `Return Request Received. Hi ${props.order.customerName}, We have received your return request for order #${props.order.id.slice(-6).toUpperCase()}. We will review it shortly.`;
            break;
        case 'returnStatus':
            subject = `Update on your return for Order #${props.order.id.slice(-6).toUpperCase()}`;
            body = `<h1>Return Status Update</h1><p>Hi ${props.order.customerName},</p><p>There's an update on your return request for order #${props.order.id.slice(-6).toUpperCase()}.</p><p><strong>Status:</strong> ${props.statusMessage}</p><p>You can view your order details here: <a href="https://thewhitewolf.shop/orders">My Orders</a></p>`;
            text = `Return Status Update. Hi ${props.order.customerName}, There's an update on your return request for order #${props.order.id.slice(-6).toUpperCase()}. Status: ${props.statusMessage}`;
            break;
        default:
             body = '<h1>Notification</h1><p>This is a default notification from White Wolf.</p>';
             text = 'This is a default notification from White Wolf.';
    }

    const fullHtml = `<!DOCTYPE html>
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


export type EmailTemplateName = 'welcome' | 'orderConfirmation' | 'orderShipped' | 'orderDelivered' | 'orderCancelled' | 'returnRequested' | 'returnStatus';

export interface EmailTemplateProps {
  to: string;
  templateName: EmailTemplateName;
  props: any;
}

export const sendEmail = async ({ to, templateName, props }: EmailTemplateProps) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.error("SENDGRID_API_KEY is not configured. Cannot send email.");
    // In a real app, you might want to throw an error or handle this more gracefully.
    return;
  }
  
  const { subject, html, text } = getEmailHtml(templateName, props);
  
  const msg = {
    to: to,
    from: {
      name: 'White Wolf',
      email: FROM_EMAIL
    },
    subject: subject,
    text: text,
    html: html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error in sendEmail function with SendGrid:', error);
    if ((error as any).response) {
      console.error((error as any).response.body)
    }
    // We re-throw the error so the calling function can handle it if needed.
    throw error;
  }
};
