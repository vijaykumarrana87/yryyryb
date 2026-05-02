const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require('fs');
const app = express();

// ==========================================
// 👇 BOT CONFIG (Apna Token & Admin ID Dalna)
const token = process.env.MY_API_KEY; 
const adminId = '5966080889'; 
// ==========================================

const bot = new TelegramBot(token, {polling: true});

// ==========================================
// 🎹 KEYBOARDS (MENUS)
// ==========================================

// 1. MAIN MENU (Update Button Added at Top)
const mainKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "Update 🔄" }], // 🔥 NEW TOP BUTTON
            [{ text: "USDT 💎" }, { text: "UPI 🇮🇳" }], 
            [{ text: "About ℹ️" }, { text: "Talk to Us 💬" }],
            [{ text: "Join Main Channel 📢" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    }
};

// 2. ABOUT MENU (Sub-Menu)
const aboutKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "Terms & Conditions 📜" }],
            [{ text: "About Payment 💸" }],
            [{ text: "Back 🔙" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    }
};

// ==========================================
// 📩 MESSAGE HANDLER
// ==========================================

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // -------------------------------------------------
    // 👑 1. ADMIN REPLY SYSTEM
    // -------------------------------------------------
    if (chatId.toString() === adminId.toString() && text && text.startsWith('(')) {
        const match = text.match(/^\((\d+)\)\s*(.+)/);
        if (match) {
            const targetUserId = match[1];
            const replyMessage = match[2];
            
            try {
                const chat = await bot.getChat(targetUserId);
                const userName = chat.first_name || "User";
                
                // Professional Format
                const finalMsg = `Hey, ${userName} 👋\n\n${replyMessage}`;
                
                await bot.sendMessage(targetUserId, finalMsg);
                bot.sendMessage(adminId, `✅ Reply sent to ${userName}`);
            } catch (error) {
                bot.sendMessage(adminId, "❌ Failed. User might have blocked the bot.");
            }
        }
        return;
    }

    // -------------------------------------------------
    // 🤖 2. USER COMMANDS
    // -------------------------------------------------

    // --- START / BACK / UPDATE (All Trigger Main Menu) ---
    if (text === '/start' || text === 'Back 🔙' || text === 'Update 🔄') {
        bot.sendMessage(chatId, "👋 **Welcome to TenSMS Support!**\n\nSelect an option below to proceed:", { parse_mode: 'Markdown', ...mainKeyboard });
        return;
    }

    // --- USDT (Crypto) ---
    if (text === "USDT 💎") {
        const caption = 
`💎 <b>USDT Deposit Address:</b>
<code>0x9cfb27381d4F91AeCCe5e9C5ce5c3cabfB7C5c2E</code>

🔹 <b>Network:</b> USDT/BNB Chain (BEP20)
💵 <b>Rate:</b> 1 USDT = 89 Rs
🔻 <b>Min Recharge:</b> 20 Rs

⚠️ <i>Send only USDT (BEP20). Other tokens will be lost.</i>

✅ <b>After Payment:</b> Send your Email & Transaction Screenshot here.`;

        if (fs.existsSync('./qr.jpg')) {
            await bot.sendPhoto(chatId, './qr.jpg', { caption: caption, parse_mode: 'HTML' });
        } else {
            bot.sendMessage(chatId, caption, { parse_mode: 'HTML' });
        }
        return;
    }

    // --- UPI (QR2 Logic) ---
    if (text === "UPI 🇮🇳") {
        const caption = 
`🇮🇳 <b>UPI Payment</b>

🆔 <b>UPI ID:</b> <code>voiceofrupam@fam</code>
(Tap ID to Copy)

🔻 <b>Minimum Payment:</b> ₹30 Rs

📝 <b>Steps:</b>
1. Pay using any UPI App.
2. Come back here.
3. Send your <b>Logged-in Email</b>, <b>Name</b> and <b>Screenshot/UTR</b>.

⏳ <i>Verification is manual, please wait after sending details.</i>`;

        if (fs.existsSync('./qr2.jpg')) {
            await bot.sendPhoto(chatId, './qr2.jpg', { caption: caption, parse_mode: 'HTML' });
        } else {
            bot.sendMessage(chatId, "⚠️ UPI QR Image Missing (qr2.jpg).\n\n" + caption, { parse_mode: 'HTML' });
        }
        return;
    }

    // --- ABOUT MENU TRIGGER ---
    if (text === "About ℹ️") {
        bot.sendMessage(chatId, "ℹ️ <b>Information Section</b>\nChoose a topic:", { parse_mode: 'HTML', ...aboutKeyboard });
        return;
    }

    // --- SUBMENU: Terms & Conditions ---
    if (text === "Terms & Conditions 📜") {
        const legalText = 
`📜 <b>Terms & Conditions (Disclaimer)</b>

🇬🇧 <b>English:</b>
These virtual numbers are provided strictly for <b>Educational and Testing purposes</b> (specifically for Microsoft Services). We are not responsible for any misuse of these numbers. The user is solely responsible for their actions and legal consequences. By using this service, you agree to these terms.

🇮🇳 <b>Hindi:</b>
Ye virtual numbers sirf <b>Educational aur Testing purposes</b> (khas kar Microsoft Services) ke liye diye ja rahe hain. Inka kisi bhi galat kaam mein istemal karne par hum zimmedar nahi honge. User apne actions ka khud poora zimmedar hoga. Is service ko use karke aap in sharton ko maante hain.`;
        
        bot.sendMessage(chatId, legalText, { parse_mode: 'HTML' });
        return;
    }

    // --- SUBMENU: About Payment ---
    if (text === "About Payment 💸") {
        const payText = 
`💸 <b>Payment Policy</b>

Our payment process is <b>NOT Automatic</b>. It is <b>Manual</b>. 🤚

🛡️ <b>Why?</b>
Because we care about your safety and want to verify every transaction to prevent fraud/scams.

⏳ <b>Processing Time:</b>
Since it is manual, adding funds might take some time (usually 10-30 mins). Please be patient after sending the screenshot.`;

        bot.sendMessage(chatId, payText, { parse_mode: 'HTML' });
        return;
    }

    // --- JOIN CHANNEL ---
    if (text === "Join Main Channel 📢") {
        bot.sendMessage(chatId, "📢 <b>Join our Official Channel for Updates:</b>\n\n👉 @teamten_devs", { parse_mode: 'HTML' });
        return;
    }

    // --- TALK TO US ---
    if (text === "Talk to Us 💬") {
        bot.sendMessage(chatId, "💬 <b>Support</b>\n\nPlease type your query/message below. Our Admin will reply soon.");
        return;
    }

    // -------------------------------------------------
    // 📨 3. FORWARD MESSAGES TO ADMIN
    // -------------------------------------------------
    
    if (chatId.toString() !== adminId.toString()) {
        const firstName = (msg.from.first_name || "User").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const username = msg.from.username ? "@" + msg.from.username : "No Username";
        const userId = msg.from.id;
        const messageContent = (text || "[Media/Sticker]").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const reportText = 
`📩 <b>NEW MESSAGE</b>

👤 <b>Name:</b> ${firstName}
🆔 <b>ID:</b> <code>${userId}</code>
🔗 <b>Handle:</b> ${username}

💬 <b>Message:</b>
${messageContent}

👇 <b>Tap to Reply:</b>
<code>(${userId}) </code>`; 

        bot.sendMessage(adminId, reportText, { parse_mode: 'HTML' })
           .catch(() => bot.sendMessage(adminId, `New Message from ${userId}:\n${text}`));

        if (msg.photo) {
            bot.forwardMessage(adminId, chatId, msg.message_id);
        }
    }
});

// ==========================================
// 🌐 KEEP ALIVE SERVER
// ==========================================
app.get('/', (req, res) => {
    res.send('✅ TenSMS Bot is Running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bot Server running on port ${PORT}`);
});
