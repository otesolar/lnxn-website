"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";

export default function CartDrawer() {
  const { items, count, subtotal, isOpen, closeCart, removeItem, setQty } = useCart();

  return (
    <>
      <div
        onClick={closeCart}
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
            Your Cart {count > 0 && <span className="text-gold">({count})</span>}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-white/70 hover:text-gold-light"
            aria-label="Close cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

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
              <Link href="/shop" onClick={closeCart} className="btn btn-gold mt-6">
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
                      Size {item.size}
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
            <a href="https://thelnxn.com/checkout" className="btn btn-gold mt-4 w-full">
              Checkout Securely
            </a>
            <button
              onClick={closeCart}
              className="mt-3 w-full text-center text-xs uppercase tracking-[0.2em] text-white/60 hover:text-gold-light"
            >
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
