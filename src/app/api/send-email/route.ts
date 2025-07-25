
import { NextResponse } from 'next/server';
import { sendEmail as sendEmailCore, EmailTemplateProps } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body: Omit<EmailTemplateProps, 'to'> & { to: string } = await request.json();

    if (!body.to || !body.templateName) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await sendEmailCore(body);

    return NextResponse.json({ message: 'Email prepared successfully' });
  } catch (error) {
    console.error('Error in send-email API:', error);
    // In production, you might want to avoid sending back detailed error messages.
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
