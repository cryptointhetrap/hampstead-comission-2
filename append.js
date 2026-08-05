# Hampstead Commission Logger

Take a photo of a filled-out, manager-signed commission payout slip; the app reads
the handwritten amounts, shows them for review, and appends the confirmed row to a
Google Sheet.

- `public/index.html` — the whole frontend (camera/library buttons, review screen). No build step.
- `api/extract.js` — serverless function: sends the photo to Claude and gets back structured fields.
- `api/append.js` — serverless function: appends the confirmed row to your Google Sheet.
- `vercel.json` — tells Vercel to serve `public/` as the site root.

## 1. Create the Google Sheet

1. Create a new Google Sheet.
2. Rename the first tab to exactly `Deals Log` (case-sensitive).
3. Put these 15 headers in row 1, columns A–O:

   `Delivery Date` | `Stock #` | `Customer` | `Sales Rep` | `Trade Title/Lien Received?` | `Base` | `1295 Cert` | `695-1195 Cert` | `Increased Cert Over 1295 (40%)` | `Financed` | `Cash Rebate (20%)` | `Anthony's Cars` | `1st 14 Days of Syndication` | `Hold on Trades (20%)` | `Total Payout`

4. Copy the Sheet ID out of its URL — the long string between `/d/` and `/edit`.

## 2. Create a Google service account

1. https://console.cloud.google.com/ → create a project.
2. **APIs & Services > Library** → enable **Google Sheets API**.
3. **Credentials > Create Credentials > Service Account** → name it, skip the roles step.
4. Open it → **Keys > Add Key > Create new key > JSON** → downloads a `.json` file. Keep it private.
5. From that JSON you need `client_email` (→ `GOOGLE_SERVICE_ACCOUNT_EMAIL`) and `private_key` (→ `GOOGLE_PRIVATE_KEY`).
6. In the Google Sheet: **Share** → add that `client_email` as **Editor**.

## 3. Get an Anthropic API key

https://console.anthropic.com → **Settings > API Keys > Create Key**. Reading one slip costs a fraction of a cent.

## 4. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. https://vercel.com → **Add New > Project** → import the repo.
3. Add all 5 environment variables from `.env.example` (set `APP_PASSCODE` to any PIN — it's the only thing protecting the sheet).
4. **Deploy.**

If the deployed URL returns **403**, that's Vercel's own access wall, not the app:
**Settings > Deployment Protection > Vercel Authentication → off.**

## 5. Put it on her phone

Open the URL in Safari → **Share** → **Add to Home Screen**.

## 6. Using it

1. Open the app, enter the passcode once.
2. Take a photo of the completed, signed payout slip (or pick one from the library).
3. Review every field against the slip — handwriting reads can be wrong.
4. Tap **Add to Spreadsheet**.

## Notes / limitations

- Total Payout is written as a calculated number, not a live formula.
- "Trade Title/Lien Received?" isn't on the printed slip — it defaults to Yes in the app.
- The passcode is the only access control. Fine for one person, not for a public URL.
- A blurry or angled photo may come back blank — an empty field beats a wrong guess. Fill it in by hand and confirm.
