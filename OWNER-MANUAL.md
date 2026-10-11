# LNXN Website — Owner's Manual

Plain-language guide for you, the owner. Written 2026-10-10.
No code knowledge needed. Keep this somewhere safe.

## Your accounts and what each one does

| Account | What it holds | What it's for |
|---|---|---|
| **GitHub** (otesolar) | The code for the new site, repo `lnxn-website` | Every change to the site goes through here first |
| **Vercel** | The live new site, currently `lnxn-website.vercel.app` | Puts the code online so customers can see it |
| **Hostinger** | Your `thelnxn.ca` domain (bought Oct 10) | The test address for the pilot; also hosts WordPress |
| **WordPress / WooCommerce** (on thelnxn.com today) | Your products, orders, and the Printify connection | Stays as the "engine" behind the new site — products, checkout, orders, printing |
| **Printify** | Actually makes and ships the clothes | Unchanged — it keeps talking to WooCommerce |

Nobody else owns any of these. Don't share logins with me — I work through
the temporary codes you approve, never your passwords.

## The three secrets you must not lose

1. **WooCommerce API key** (Read/Write) — you'll create this in WordPress
   when we start the pilot. It lets the new site read your products.
2. **Vercel environment variables** — `WOO_URL`, `WOO_CONSUMER_KEY`,
   `WOO_CONSUMER_SECRET`. You paste these into Vercel's settings once.
3. **Your domain accounts** — wherever `thelnxn.com` is registered and
   Hostinger. If you ever lose access to one of these, nothing else
   can be fixed quickly.

Write these down somewhere outside your phone — a notebook is fine.

## How changes get to the live site (the honest version)

The site code lives on GitHub. To put a change online:
1. I make the change locally and show it to you first.
2. When you approve, I push it to GitHub.
3. Pushing needs your tap: GitHub sends a device code to your phone, it
   expires in 15 minutes. One tap authorizes it.
4. Vercel sees the push and redeploys automatically — usually live in
   a couple of minutes.

**Practical tip:** because each push costs you a phone tap, we batch
changes — several updates go live in one push.

## How you'll update products yourself

Once the pilot is wired up, you keep managing products the way you do
today: in WooCommerce (WordPress dashboard). Add a product, change a
price, mark something out of stock — the new site reads it from
WooCommerce and shows it automatically. You never have to touch code
or call me for routine changes.

## The big switch, in plain words (thelnxn.com cutover)

This is the plan we discussed — nothing here is done yet, and nothing
happens until you say so:

1. The new site gets tested on `thelnxn.ca` first, including a real
   test order (placed, then cancelled immediately so nothing prints).
2. When the test is clean, we point `thelnxn.com` at Vercel (one DNS
   change: the apex record → `76.76.21.21`).
3. WordPress/WooCommerce moves to a subdomain (like `wp.thelnxn.com`)
   and keeps running the products, orders, and Printify connection.
4. Old product links keep working — 21 redirects are already mapped
   (see `cutover/CUTOVER-CHECKLIST.md`).

**If anything goes wrong:** flipping that one DNS record back restores
the old site within minutes. That's the safety net.

## What I can do without you, and what I can't

- I can do: write code, draft checklists, build videos, show you previews.
- I can't do (only you): tap the GitHub code on your phone, paste
  secrets into Vercel/Hostinger, buy or transfer domains, click
  "buy" in a store dashboard.

## Quick glossary

- **Repo** — a folder on GitHub where the site's code lives.
- **Push / deploy** — sending new code online.
- **DNS** — the phonebook that decides where your domain name points.
- **Subdomain** — a prefix address like `wp.thelnxn.com`; same account,
  different corner.
- **Headless WooCommerce** — our plan: the new site shows the storefront,
  WooCommerce still handles products and orders in the background.
