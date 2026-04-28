import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, chatId = '7271452485' } = body;
    
    const BOT_TOKEN = '8519877001:AAFUU7sq1cR3L-Rcsp_p1tydU0SiG2zvbwk';
    
    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      }),
    });

    if (telegramResponse.ok) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to send to Telegram' });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' });
  }
}
