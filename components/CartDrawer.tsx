"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";
import { getRegionsForCountry } from "@/lib/regions";

const COUNTRIES = [
  { code: "CA", name: "Canada" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
];

interface CustomerForm {
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

const EMPTY_FORM: CustomerForm = {
  email: "",
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postcode: "",
  country: "CA",
};

const inputCls =
  "w-full border border-line bg-ink px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none";
const labelCls =
  "mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-smoke";

export default function CartDrawer() {
  const { items, count, subtotal, isOpen, closeCart, removeItem, setQty } = useCart();
  const [placing, setPlacing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [step, setStep] = useState<"cart" | "details">("cart");
  const [form, setForm] = useState<CustomerForm>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  function set<K extends keyof CustomerForm>(key: K, value: CustomerForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function goToDetails() {
    setCheckoutError(null);
    setFormError(null);
    setStep("details");
  }

  function validateForm(): string | null {
    const f = form;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim()))
      return "Please enter a valid email address.";
    if (!f.firstName.trim() || !f.lastName.trim())
      return "Please enter your first and last name.";
    if (!f.address1.trim()) return "Please enter your street address.";
    if (!f.city.trim()) return "Please enter your city.";
    if (!f.state.trim()) return "Please enter your province / state.";
    if (!f.postcode.trim()) return "Please enter your postal / ZIP code.";
    return null;
  }

  async function handlePlaceOrder() {
    if (placing) return;
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }
    setPlacing(true);
    setCheckoutError(null);
    setFormError(null);
    try {
      const customer = {
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        address1: form.address1.trim(),
        ...(form.address2.trim() ? { address2: form.address2.trim() } : {}),
        city: form.city.trim(),
        state: form.state.trim(),
        postcode: form.postcode.trim(),
        country: form.country,
      };
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, size: i.size, color: i.color, qty: i.qty })),
          customer,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        payment_url?: string;
        error?: string;
      } | null;
      if (!res.ok || !data?.payment_url) {
        throw new Error(
          typeof data?.error === "string" && data.error
            ? data.error
            : "We couldn't start your checkout just now. Please try again.",
        );
      }
      window.location.href = data.payment_url;
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
      setPlacing(false);
    }
  }

  function handleClose() {
    closeCart();
    // Reset to cart step when closed so it reopens fresh.
    setTimeout(() => {
      setStep("cart");
      setCheckoutError(null);
      setFormError(null);
    }, 300);
  }

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-50 bg-black/70 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-coal transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="display text-lg">
            {step === "cart" ? (
              <>Your Cart {count > 0 && <span className="text-gold">({count})</span>}</>
            ) : (
              <>Shipping Details</>
            )}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-white/70 hover:text-gold-light"
            aria-label="Close cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {step === "cart" ? (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Image
                    src="/brand/lnxn-mark.png"
                    alt=""
                    width={56}
                    height={56}
                    className="opacity-50"
                  />
                  <p className="mt-6 text-white/70">Your cart is empty.</p>
                  <Link href="/shop" onClick={handleClose} className="btn btn-gold mt-6">
                    Shop the Collection
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {items.map((item) => (
                    <li key={item.key} className="flex gap-4 py-5">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-ink">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <h3 className="text-sm font-semibold leading-snug">{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.key)}
                            className="text-white/40 hover:text-gold-light"
                            aria-label={`Remove ${item.name}`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                              <path d="M6 6l12 12M18 6L6 18" />
                            </svg>
                          </button>
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-smoke">
                          {item.color ? `${item.color} · ` : ""}Size {item.size}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center border border-line">
                            <button
                              onClick={() => setQty(item.key, item.qty - 1)}
                              className="px-3 py-1.5 hover:text-gold-light"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm">{item.qty}</span>
                            <button
                              onClick={() => setQty(item.key, item.qty + 1)}
                              className="px-3 py-1.5 hover:text-gold-light"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-semibold text-gold-light">
                            {formatPrice(item.price * item.qty)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-line px-6 py-5">
                <div className="flex justify-between text-sm">
                  <span className="uppercase tracking-[0.2em] text-smoke">Subtotal</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-smoke">
                  Shipping & taxes calculated at checkout.
                </p>
                <button
                  onClick={goToDetails}
                  className="btn btn-gold mt-4 w-full"
                >
                  Checkout Securely
                </button>
                <button
                  onClick={handleClose}
                  className="mt-3 w-full text-center text-xs uppercase tracking-[0.2em] text-white/60 hover:text-gold-light"
                >
                  Continue shopping
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <p className="text-sm text-smoke">
                Where should we send your order? You&apos;ll complete payment on the next step.
              </p>
              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="co-email" className={labelCls}>Email</label>
                  <input
                    id="co-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="co-first" className={labelCls}>First name</label>
                    <input
                      id="co-first"
                      type="text"
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="co-last" className={labelCls}>Last name</label>
                    <input
                      id="co-last"
                      type="text"
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="co-addr1" className={labelCls}>Street address</label>
                  <input
                    id="co-addr1"
                    type="text"
                    autoComplete="street-address"
                    placeholder="House number and street"
                    value={form.address1}
                    onChange={(e) => set("address1", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="co-addr2" className={labelCls}>
                    Apartment, suite, etc. <span className="normal-case text-white/40">(optional)</span>
                  </label>
                  <input
                    id="co-addr2"
                    type="text"
                    value={form.address2}
                    onChange={(e) => set("address2", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="co-city" className={labelCls}>City</label>
                    <input
                      id="co-city"
                      type="text"
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="co-state" className={labelCls}>Province / State</label>
                    {(() => {
                      const regions = getRegionsForCountry(form.country);
                      if (regions) {
                        return (
                          <select
                            id="co-state"
                            autoComplete="address-level1"
                            value={form.state}
                            onChange={(e) => set("state", e.target.value)}
                            className={inputCls}
                          >
                            <option value="">Select…</option>
                            {regions.map((r) => (
                              <option key={r.code} value={r.code}>
                                {r.name} ({r.code})
                              </option>
                            ))}
                          </select>
                        );
                      }
                      return (
                        <input
                          id="co-state"
                          type="text"
                          autoComplete="address-level1"
                          placeholder="Province / State"
                          value={form.state}
                          onChange={(e) => set("state", e.target.value)}
                          className={inputCls}
                        />
                      );
                    })()}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="co-postcode" className={labelCls}>Postal / ZIP code</label>
                    <input
                      id="co-postcode"
                      type="text"
                      autoComplete="postal-code"
                      value={form.postcode}
                      onChange={(e) => set("postcode", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="co-country" className={labelCls}>Country</label>
                    <select
                      id="co-country"
                      value={form.country}
                      onChange={(e) => {
                        set("country", e.target.value);
                        set("state", "");
                      }}
                      className={inputCls}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {formError ? (
                <p className="mt-4 border border-red-900/70 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                  {formError}
                </p>
              ) : null}
              {checkoutError ? (
                <div className="mt-4 border border-red-900/70 bg-red-950/40 px-4 py-3">
                  <p className="text-sm text-red-200">{checkoutError}</p>
                  <button
                    onClick={handlePlaceOrder}
                    className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-red-200 underline hover:text-white"
                  >
                    Try again
                  </button>
                </div>
              ) : null}
            </div>
            <div className="border-t border-line px-6 py-5">
              <div className="flex justify-between text-sm">
                <span className="uppercase tracking-[0.2em] text-smoke">Subtotal</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="btn btn-gold mt-4 w-full disabled:cursor-wait disabled:opacity-60"
              >
                {placing ? "Placing your order…" : "Continue to Payment"}
              </button>
              <button
                onClick={() => setStep("cart")}
                className="mt-3 w-full text-center text-xs uppercase tracking-[0.2em] text-white/60 hover:text-gold-light"
              >
                ← Back to cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
