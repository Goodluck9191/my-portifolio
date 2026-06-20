import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkRateLimit } from "@/lib/utils";
import { Resend } from "resend";

const db = () => getSupabaseAdmin();

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(ip, 3, 60000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const { error } = await db()
      .from("subscribers")
      .insert({ email, ip_address: ip });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "You're already subscribed!" },
          { status: 409 }
        );
      }
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 }
      );
    }

    if (resend && process.env.RESEND_FROM_EMAIL) {
      // Send welcome email to subscriber
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: email,
          subject: "Thanks for subscribing!",
          html: `
            <h2>Welcome to the newsletter!</h2>
            <p>You'll now receive updates when I publish new articles on web development, system design, and AI.</p>
            <p>Cheers,</p>
            <p>Goodluck Johnson</p>
          `,
        });
      } catch (emailErr) {
        console.error("Failed to send welcome email:", emailErr);
      }

      // Send notification to site owner
      if (process.env.CONTACT_NOTIFICATION_EMAIL) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL,
            to: process.env.CONTACT_NOTIFICATION_EMAIL,
            subject: "New newsletter subscriber!",
            html: `
              <h2>New Subscriber</h2>
              <p><strong>Email:</strong> ${email}</p>
              <hr/>
              <p>Someone just subscribed to your newsletter.</p>
            `,
          });
        } catch (notifErr) {
          console.error("Failed to send subscriber notification:", notifErr);
        }
      }
    }

    return NextResponse.json(
      { message: "Subscribed successfully!" },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/subscribe error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
