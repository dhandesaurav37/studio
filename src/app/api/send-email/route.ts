
import { NextResponse } from 'next/server';
import { sendEmail, EmailTemplateProps } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body: EmailTemplateProps = await request.json();

    // In a real application, you would add more robust validation here.
    if (!body.to || !body.subject || !body.templateName) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await sendEmail(body);

    return NextResponse.json({ message: 'Email prepared successfully' });
  } catch (error) {
    console.error('Error in send-email API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
