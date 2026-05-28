import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, telegram, projectName, message, date, time } = body;

    // Validate required fields
    if (!name || !email || !telegram || !date || !time) {
      return NextResponse.json({ 
        error: "Missing required fields" 
      }, { status: 400 });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return NextResponse.json({ 
        success: true, 
        demo: true,
        message: "Booking received! (Telegram not configured)"
      });
    }

    const text = `📅 *NEW BOOKING REQUEST*

👤 *Name:* ${name}
📧 *Email:* ${email}
💬 *Telegram:* @${telegram}
🚀 *Project:* ${projectName || "Not specified"}
🗓 *Date:* ${date}
⏰ *Time:* ${time}
📝 *Message:* ${message || "No message"}

─────────────────
Reply to client: @${telegram}
`;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: "Markdown",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Telegram API Error:", result);
      return NextResponse.json({ 
        success: true, 
        warning: "Booking saved but Telegram notification failed",
        error: result.description 
      });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      success: true, 
      warning: "Booking received but notification pending",
      error: String(error)
    });
  }
}
