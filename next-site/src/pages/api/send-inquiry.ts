import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;
    // In a real application, you would use a service like Nodemailer
    // to send the email. For this example, we'll just log the data.
    console.log('Sending email:', { name, email, message });
    res.status(200).json({ message: 'Email sent successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
