// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Basic validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email is required and must be valid' }, 
        { status: 400 }
      );
    }

    // Mailchimp API credentials
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const LIST_ID = process.env.MAILCHIMP_LIST_ID;
    const DC = API_KEY?.split('-')[1]; // Datacenter from API key
    
    if (!API_KEY || !LIST_ID || !DC) {
      return NextResponse.json(
        { error: 'Mailchimp configuration is missing' }, 
        { status: 500 }
      );
    }

    // Create subscriber hash for email (md5)
    const subscriberHash = crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');

    // Prepare request to Mailchimp API
    const response = await fetch(
      `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${subscriberHash}`,
      {
        method: 'PUT', // Use PUT to insert or update
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`anystring:${API_KEY}`).toString('base64')}`,
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed', // Use 'pending' for double opt-in
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Failed to subscribe' }, 
        { status: 500 }
      );
    }

    console.log('Subscription successful:', email);
    console.log('Data:', data);

    return NextResponse.json({ message: 'Subscription successful' });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' }, 
      { status: 500 }
    );
  }
}