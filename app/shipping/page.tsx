import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-16">
      <p className="eyebrow">Policy</p>
      <h1 className="display mt-3 text-3xl md:text-5xl">Shipping Policy</h1>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-white/65">
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-gold-light">
            Processing time
          </h2>
          <p className="mt-3">
            Standard processing time for orders is 2–3 business days.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-gold-light">
            Delivery
          </h2>
          <p className="mt-3">
            Once dispatched, orders arrive in approximately 3 business days.
            Every order ships with tracking, sent to the email address used at
            checkout.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-gold-light">
            Shipping costs
          </h2>
          <p className="mt-3">
            Shipping costs are calculated at checkout based on your delivery
            address and the available options for your order.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-gold-light">
            Delays & issues
          </h2>
          <p className="mt-3">
            If your order hasn&apos;t arrived within 10 business days, or if
            anything arrives damaged or incorrect,{" "}
            <Link
              href="/contact"
              className="text-gold-light underline underline-offset-4 hover:text-gold"
            >
              contact us
            </Link>{" "}
            and we&apos;ll make it right.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-gold-light">
            Returns
          </h2>
          <p className="mt-3">
            If something isn&apos;t right, easy returns are available. Reach
            out through our{" "}
            <Link
              href="/contact"
              className="text-gold-light underline underline-offset-4 hover:text-gold"
            >
              contact page
            </Link>{" "}
            and we&apos;ll take care of it.
          </p>
        </section>
      </div>
    </div>
  );
}
