"use client";

import { useState } from "react";
import SocialLinks from "@/components/SocialLinks";

const TOPICS = [
  "Order question",
  "Sizing help",
  "Returns & exchanges",
  "Wholesale",
  "Something else",
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  const inputCls =
    "w-full border border-line bg-coal px-4 py-3 text-sm outline-none placeholder:text-smoke focus:border-gold";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
      <p className="eyebrow">Get in touch</p>
      <h1 className="display mt-3 text-3xl md:text-5xl">Contact Us</h1>
      <p className="mt-4 max-w-xl leading-relaxed text-white/65">
        Questions about an order, sizing, or anything else — reach out and
        we&apos;ll get back to you.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
                Email
              </p>
              <a
                href="mailto:info@thelnxn.com"
                className="mt-2 block text-lg hover:text-gold-light"
              >
                info@thelnxn.com
              </a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
                Phone
              </p>
              <a
                href="tel:+12048875051"
                className="mt-2 block text-lg hover:text-gold-light"
              >
                +1 (204) 887-5051
              </a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
                Follow
              </p>
              <SocialLinks className="mt-3" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              aria-label="Your name"
              className={inputCls}
            />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              aria-label="Your email"
              className={inputCls}
            />
          </div>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            aria-label="Topic"
            className={inputCls}
          >
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <textarea
            required
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help?"
            aria-label="Message"
            className={inputCls}
          />
          <button
            type="submit"
            disabled={status === "sending" || status === "sent"}
            className="btn btn-gold w-full sm:w-auto disabled:opacity-60"
          >
            {status === "sending"
              ? "Sending…"
              : status === "sent"
                ? "Message Sent ✓"
                : "Send Message"}
          </button>
          {status === "sent" && (
            <p className="text-sm text-gold-light">
              Thanks — we&apos;ll get back to you soon.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          {status === "idle" && (
            <p className="text-xs text-smoke">
              We&apos;ll reply to the email address you provide.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
