import { NextResponse } from 'next/server';
import { z } from 'zod';

const inquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required").max(1000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = inquirySchema.parse(body);
    const { name, email, message } = validatedData;

    // In a real application, you would use a service like Nodemailer
    // to send the email. For this example, we'll just log the data.
    console.log('Sending email:', { name, email, message });
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    console.error('Error processing inquiry:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
