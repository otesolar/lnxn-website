import { NextResponse } from "next/server";

const WOO_URL = (process.env.WOO_URL ?? "").replace(/\/+$/, "");

const TOPICS = [
  "Order question",
  "Sizing help",
  "Returns & exchanges",
  "Wholesale",
  "Something else",
];

/**
 * Contact form submission. Validates input, then forwards to the
 * WordPress contact endpoint (Snippets plugin) which sends via wp_mail().
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const o = (body ?? {}) as Record<string, unknown>;
  const name = typeof o.name === "string" ? o.name.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim() : "";
  const topic = typeof o.topic === "string" ? o.topic.trim() : "";
  const message = typeof o.message === "string" ? o.message.trim() : "";

  if (name.length < 2 || name.length > 100) {
    return NextResponse.json(
      { error: "Please provide your name." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 100) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }
  if (!TOPICS.includes(topic)) {
    return NextResponse.json({ error: "Please choose a topic." }, { status: 400 });
  }
  if (message.length < 10 || message.length > 5000) {
    return NextResponse.json(
      { error: "Please write a message (at least 10 characters)." },
      { status: 400 },
    );
  }
  if (!WOO_URL) {
    return NextResponse.json(
      { error: "Message service is not available right now." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(`${WOO_URL}/wp-json/lnxn/v1/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, topic, message }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as {
        message?: string;
      } | null;
      throw new Error(data?.message ?? `WordPress returned ${res.status}`);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(
      "Contact form failed:",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: "We couldn't send your message just now. Please try again." },
      { status: 502 },
    );
  }
}
