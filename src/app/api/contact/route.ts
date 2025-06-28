import { NextResponse } from "next/server";
import Mailjet from "node-mailjet";
import dotenv from "dotenv";

dotenv.config();

// Initialize Mailjet with your API credentials
const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY || "",
  apiSecret: process.env.MAILJET_SECRET_KEY || "",
});

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, message } = await request.json();

    // Validate inputs
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Send email with Mailjet
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_FROM,
            Name: "Contact Form",
          },
          To: [
            {
              Email: process.env.EMAIL_TO,
              Name: "Your Name",
            },
          ],
          Subject: `New contact from ${firstName} ${lastName}`,
          TextPart: `
            Name: ${firstName} ${lastName}
            Email: ${email}
            
            Message:
            ${message}
          `,
          HTMLPart: `
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
        },
      ],
    });

    return NextResponse.json({
      message: "Email sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email", success: false },
      { status: 500 }
    );
  }
}