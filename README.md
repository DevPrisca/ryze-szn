# RYZE - clothing brand website

React (Vite) front end + a small Node/Express server. Contact form messages and
orders are sent through the API server. Order notifications use the Resend API;
the contact form can use Gmail SMTP.

Pages: Home, Shop, Product, Cart, Checkout, Order Success, Lookbook, About, Contact, 404.

## 1. Run it on your computer

**Easiest on Windows:** put this folder somewhere simple like `C:\ryze` (not Downloads or
OneDrive), then double-click **`start.bat`**. It installs everything the first time and starts the site.

Or, in a terminal opened in the project folder (the one that contains `package.json`):

```powershell
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173). `npm run dev` starts
both the website and the order server together. If the default API port is busy,
the dev script selects an available port and configures the website proxy to use it.

## 2. Order notifications with Resend

Order notifications are sent from `onboarding@resend.dev` to
`makindepriscilla5@gmail.com`. They include the order ID and total, and are
saved to a local queue so temporary Resend or network errors can be retried.

1. Create a Resend API key in your Resend account.
2. Add it to the project `.env` file:

```
RESEND_API_KEY=re_your_api_key
```

3. Add `RESEND_API_KEY` to the Render service's private environment variables
   as well. Never commit `.env` or paste its value into chat.
4. Restart the server. It should log `Resend order notifications: ON`.

The server must be running and have internet access to deliver queued messages.
Pending order notifications retry after the connection is restored. The contact
form still uses Gmail SMTP; set `GMAIL_USER` and `GMAIL_APP_PASSWORD` if you
want contact form messages sent by email.

Never share the `.env` file or put it on GitHub (it is already in `.gitignore`).

## 3. Change contact details, social profiles, and delivery fee

Edit **`src/config.js`**. Set your phone numbers and WhatsApp numbers
(digits only, with country code, e.g. `2348031234567`), email, and social profile
URLs and handles.

## 4. Add or edit products and photos

Edit **`src/data/products.js`**. To use real photos, put the pictures in the
`public/images/` folder and set, for example, `image: "/images/kite-tee.jpg"`.
To add a product to a page, add a `<ProductCard slug="your-slug" />` line in
`src/pages/Shop.jsx` (and Home if you want it featured).

## 5. Deploy on Render

The root `render.yaml` defines one Node web service: Render builds the Vite
frontend and Express serves both the site and API. It uses a paid always-on
service with a persistent disk so saved orders and queued email notifications
survive restarts. Review Render's current charges before creating the service.

1. Push this repository to GitHub and connect it to Render.
2. In Render, choose **New > Blueprint** and select this repository. Review the
   service and disk costs before confirming creation.
3. Enter `RESEND_API_KEY` in Render's private environment-variable form. Add
   `GMAIL_USER` and `GMAIL_APP_PASSWORD` only if you want email for contact
   form messages.
   Never commit `.env` or paste its values into chat.
4. After the deploy succeeds, open the service's `onrender.com` URL and check
   `/api/health`.

Render's free web services sleep and have ephemeral storage, so they are not
suitable for always-available order email notifications.

## 6. Deploy on another Node host

```powershell
npm run build
npm start
```

`npm start` serves the website and the order server together on one port
(default 5000). Host it on any Node host (Render, Railway, a VPS). Set the
same values from `.env` in the host's "environment variables" settings.
Some hosts erase files on restart. Use persistent storage for
`server/orders.json` and the email queue if you need them to survive restarts.

## How orders work

- Customer fills the checkout form -> server checks everything -> saves the order
  -> queues email notifications -> shows the customer an order number.
- Prices are always taken from the server's product list, so nobody can change
  a price from their browser.
- Payment is **pay on delivery** or **bank transfer** (you give account details
  when you call to confirm). Card payment (for example Paystack) is not
  included yet.
