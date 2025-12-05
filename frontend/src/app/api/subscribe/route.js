import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification to inventorypredictor@gmail.com
    // 3. Add to mailing list service (like Mailchimp, SendGrid, etc.)
    
    // For now, we'll just log it and save to a simple storage
    console.log(`New subscription: ${email}`);
    
    // You can add email service integration here
    // Example with a simple email service:
    /*
    await fetch('https://api.emailservice.com/send', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
      body: JSON.stringify({
        to: 'inventorypredictor@gmail.com',
        subject: 'New Newsletter Subscription',
        text: `New subscriber: ${email}`
      })
    });
    */
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed!' 
    });
    
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ 
      error: 'Failed to subscribe' 
    }, { status: 500 });
  }
}
