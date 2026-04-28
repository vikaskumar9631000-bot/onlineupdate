// Test script to verify Telegram bot connection
const { telegramBot } = require('./src/utils/telegramBot.ts');

async function testTelegramConnection() {
  console.log('🔧 Testing Telegram Bot Connection...');
  console.log('🤖 Bot Token: 8519877001:AAFUU7sq1cR3L-Rcsp_p1tydU0SiG2zvbwk');
  console.log('👤 Chat ID: 7271452485');
  console.log('📱 Username: @vikaskumar_8102');
  
  try {
    const result = await telegramBot.testConnection();
    if (result) {
      console.log('✅ Telegram bot test successful! You should receive a test message on Telegram.');
    } else {
      console.log('❌ Telegram bot test failed. Check console for errors.');
    }
  } catch (error) {
    console.error('❌ Error testing Telegram bot:', error);
  }
}

testTelegramConnection();
