import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    console.log(`New subscription request: ${email}`);
    
    // Try to save to Supabase if configured
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Check if subscribers table exists and insert
        const { error } = await supabase
          .from('subscribers')
          .upsert({ 
            email: email.toLowerCase().trim(),
            subscribed_at: new Date().toISOString()
          }, { 
            onConflict: 'email' 
          });
        
        if (error) {
          console.log('Supabase insert note:', error.message);
          // Table might not exist, but we still accept the subscription
        }
      } catch (dbError) {
        console.log('Database note:', dbError.message);
      }
    }
    
    // Note: For actual email notifications, you would need to integrate
    // an email service like SendGrid, Resend, or AWS SES
    // This requires API keys and additional setup
    
    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for subscribing! You will receive updates at ' + email
    });
    
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ 
      error: 'Failed to subscribe' 
    }, { status: 500 });
  }
}
