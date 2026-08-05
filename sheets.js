// Appends a row to a Google Sheet using only Node built-ins — no npm packages,
// so the project needs no package.json and no install step.
const crypto = require('crypto');

const SHEET_TAB = 'Deals Log';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Exchanges the service-account key for a short-lived OAuth access token
// via the standard JWT-bearer grant.
async function getAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!email || !key) {
    throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY env vars');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(JSON.stringify({
    iss: email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }));

  const signature = base64url(
    crypto.createSign('RSA-SHA256').update(`${header}.${claim}`).sign(key)
  );
  const assertion = `${header}.${claim}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Google auth failed: ${data.error_description || data.error || res.status}`);
  }
  return data.access_token;
}

async function appendDeal(row) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error('Missing GOOGLE_SHEET_ID env var');

  const values = [[
    row.deliveryDate || '',
    row.stockNumber || '',
    row.customer || '',
    row.salesRep || '',
    row.tradeTitleReceived || '',
    row.base ?? '',
    row.cert1295 ?? '',
    row.cert695to1195 ?? '',
    row.increasedCertOver1295 ?? '',
    row.financed ?? '',
    row.cashRebate ?? '',
    row.anthonysCars ?? '',
    row.first14DaysSyndication ?? '',
    row.holdOnTrades ?? '',
    row.totalPayout ?? '',
  ]];

  const token = await getAccessToken();
  const range = encodeURIComponent(`${SHEET_TAB}!A:O`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}`
    + `/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Sheets append failed: ${data.error?.message || res.status}`);
  }
  return data;
}

module.exports = { appendDeal };
