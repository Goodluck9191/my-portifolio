import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getSupabase } from "@/lib/supabase";
import { contactSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/utils";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function getClient() {
  try {
    return getSupabaseAdmin();
  } catch {
    return getSupabase();
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = getSupabaseAdmin()
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("GET /api/contact error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error?.issues ?? [] },
        { status: 400 }
      );
    }

    const { data, error } = await getClient()
      .from("contacts")
      .insert([
        {
          ...result.data,
          ip_address: ip,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (resend && process.env.CONTACT_NOTIFICATION_EMAIL) {
      try {
        await resend.emails.send({
          from: "Portfolio Contact <noreply@yourdomain.com>",
          to: process.env.CONTACT_NOTIFICATION_EMAIL,
          subject: `New Contact: ${result.data.name} - ${result.data.project_type ?? "General"}`,
          html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${result.data.name}</p>
            <p><strong>Email:</strong> ${result.data.email}</p>
            <p><strong>Project Type:</strong> ${result.data.project_type ?? "Not specified"}</p>
            <p><strong>Budget:</strong> ${result.data.budget ?? "Not specified"}</p>
            <hr/>
            <p><strong>Message:</strong></p>
            <p>${result.data.message.replace(/\n/g, "<br/>")}</p>
          `,
        });
      } catch (emailErr) {
        console.error("Failed to send notification email:", emailErr);
      }

      try {
        await resend.emails.send({
          from: "Goodluck Johnson <noreply@yourdomain.com>",
          to: result.data.email,
          subject: "Thank you for reaching out!",
          html: `
            <h2>Thank you for contacting me!</h2>
            <p>Hi ${result.data.name},</p>
            <p>I've received your message regarding <strong>${result.data.project_type ?? "your project"}</strong> and will get back to you within 24-48 hours.</p>
            <p>In the meantime, feel free to check out my portfolio for more of my work.</p>
            <hr/>
            <p>Best regards,</p>
            <p>Goodluck Johnson</p>
          `,
        });
      } catch (autoReplyErr) {
        console.error("Failed to send auto-reply email:", autoReplyErr);
      }
    }

    return NextResponse.json(
      { message: "Message sent successfully!", data },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/contact error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
