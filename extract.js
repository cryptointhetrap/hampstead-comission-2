	const EXTRACTION_PROMPT =
    <!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<title>Hampstead Commission Logger</title>
<link rel="icon" href="data:,">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Commission Log">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0f1f33; color: #111; min-height: 100vh;
  }
  header {
    background: #1F4E78; color: #fff; padding: 18px 16px; text-align: center;
    font-weight: 700; font-size: 17px; letter-spacing: .2px;
  }
  main { max-width: 480px; margin: 0 auto; padding: 20px 16px 60px; }
  .card {
    background: #fff; border-radius: 14px; padding: 20px; margin-bottom: 16px;
    box-shadow: 0 4px 16px rgba(0,0,0,.15);
  }
  .btn {
    display: block; width: 100%; padding: 16px; border-radius: 12px; border: none;
    font-size: 17px; font-weight: 600; margin-bottom: 12px; cursor: pointer;
  }
  .btn-primary { background: #1F4E78; color: #fff; }
  .btn-secondary { background: #eef2f7; color: #1F4E78; }
  .btn-success { background: #1e7e34; color: #fff; }
  .btn:disabled { opacity: .5; }
  input[type=file] { display: none; }
  label.field { display: block; font-size: 12px; font-weight: 600; color: #555; margin: 10px 0 4px; }
  input[type=text], input[type=number], select {
    width: 100%; padding: 11px; border: 1px solid #d5dbe3; border-radius: 8px; font-size: 15px;
  }
  .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .total-box {
    margin-top: 14px; padding: 14px; background: #f2f7f2; border-radius: 10px;
    text-align: center; font-size: 20px; font-weight: 700; color: #1e7e34;
  }
  .muted { color: #667; font-size: 13px; line-height: 1.5; text-align: center; }
  .spinner {
    width: 34px; height: 34px; margin: 24px auto; border: 4px solid #dbe4ee;
    border-top-color: #1F4E78; border-radius: 50%; animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .error { background: #fdeeee; color: #a13030; padding: 12px; border-radius: 8px; font-size: 14px; margin-bottom: 12px; }
  .hidden { display: none !important; }
</style>
</head>
<body>
<header>Hampstead Preowned &middot; Commission Logger</header>
<main>

  <div id="passcodeScreen" class="card hidden">
    <label class="field">Enter passcode</label>
    <input type="text" id="passcodeInput" inputmode="numeric" placeholder="Passcode">
    <button class="btn btn-primary" id="passcodeSubmit" style="margin-top:12px">Unlock</button>
    <div id="passcodeError" class="error hidden"></div>
  </div>

  <div id="captureScreen" class="card hidden">
    <p class="muted" style="margin-top:0">Photograph a filled-out, manager-signed payout slip. Fields get pulled automatically &mdash; you'll confirm everything before it's added.</p>
    <button class="btn btn-primary" id="takePhotoBtn">&#128247; Take Photo</button>
    <button class="btn btn-secondary" id="chooseLibraryBtn">&#128444; Choose from Library</button>
    <input type="file" id="cameraInput" accept="image/*" capture="environment">
    <input type="file" id="libraryInput" accept="image/*">
  </div>

  <div id="loadingScreen" class="card hidden">
    <div class="spinner"></div>
    <p class="muted" id="loadingText">Reading the slip&hellip;</p>
  </div>

  <div id="reviewScreen" class="card hidden">
    <p class="muted" style="margin-top:0">Check every number against the photo before adding &mdash; handwriting reads can be wrong.</p>
    <div id="reviewError" class="error hidden"></div>

    <div class="row2">
      <div>
        <label class="field">Delivery Date</label>
        <input type="text" id="f_deliveryDate" placeholder="M/D/YYYY">
      </div>
      <div>
        <label class="field">Stock #</label>
        <input type="text" id="f_stockNumber">
      </div>
    </div>

    <label class="field">Customer</label>
    <input type="text" id="f_customer">

    <div class="row2">
      <div>
        <label class="field">Sales Rep</label>
        <input type="text" id="f_salesRep" value="MO">
      </div>
      <div>
        <label class="field">Trade Title/Lien Received?</label>
        <select id="f_tradeTitleReceived">
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="">N/A</option>
        </select>
      </div>
    </div>

    <div class="row2">
      <div><label class="field">Base</label><input type="number" id="f_base" step="0.01"></div>
      <div><label class="field">$1295 Cert</label><input type="number" id="f_cert1295" step="0.01"></div>
    </div>
    <div class="row2">
      <div><label class="field">$695-$1195 Cert</label><input type="number" id="f_cert695to1195" step="0.01"></div>
      <div><label class="field">Incr. Cert Over $1295</label><input type="number" id="f_increasedCertOver1295" step="0.01"></div>
    </div>
    <div class="row2">
      <div><label class="field">Financed</label><input type="number" id="f_financed" step="0.01"></div>
      <div><label class="field">Cash Rebate</label><input type="number" id="f_cashRebate" step="0.01"></div>
    </div>
    <div class="row2">
      <div><label class="field">Anthony's Cars</label><input type="number" id="f_anthonysCars" step="0.01"></div>
      <div><label class="field">1st 14 Days Syndication</label><input type="number" id="f_first14DaysSyndication" step="0.01"></div>
    </div>
    <label class="field">Hold on Trades</label>
    <input type="number" id="f_holdOnTrades" step="0.01">

    <div class="total-box">Total Payout: $<span id="computedTotal">0.00</span></div>

    <button class="btn btn-success" id="confirmBtn" style="margin-top:16px">&#9989; Add to Spreadsheet</button>
    <button class="btn btn-secondary" id="retakeBtn">&#128260; Retake Photo</button>
  </div>

  <div id="successScreen" class="card hidden">
    <p style="text-align:center; font-size:40px; margin:0">&#9989;</p>
    <p style="text-align:center; font-weight:700; font-size:18px">Added to the spreadsheet</p>
    <p class="total-box" id="successTotal"></p>
    <button class="btn btn-primary" id="anotherBtn">&#10133; Log Another Deal</button>
  </div>

</main>

<script>
const NUMERIC_KEYS = ['base','cert1295','cert695to1195','increasedCertOver1295','financed','cashRebate','anthonysCars','first14DaysSyndication','holdOnTrades'];
const PASSCODE_KEY = 'hampstead_passcode';

const screens = ['passcodeScreen','captureScreen','loadingScreen','reviewScreen','successScreen'];
function show(id) { screens.forEach(s => document.getElementById(s).classList.toggle('hidden', s !== id)); }

function getStoredPasscode() { return localStorage.getItem(PASSCODE_KEY) || ''; }

document.getElementById('passcodeSubmit').onclick = () => {
  const val = document.getElementById('passcodeInput').value.trim();
  localStorage.setItem(PASSCODE_KEY, val);
  document.getElementById('passcodeError').classList.add('hidden');
  show('captureScreen');
};

document.getElementById('takePhotoBtn').onclick = () => document.getElementById('cameraInput').click();
document.getElementById('chooseLibraryBtn').onclick = () => document.getElementById('libraryInput').click();
document.getElementById('cameraInput').onchange = (e) => handleFile(e.target.files[0]);
document.getElementById('libraryInput').onchange = (e) => handleFile(e.target.files[0]);

function resizeImage(file, maxDim = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      img.onload = () => {
        let width = img.width, height = img.height;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality).split(',')[1]);
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function handleFile(file) {
  if (!file) return;
  show('loadingScreen');
  try {
    const base64 = await resizeImage(file);
    const res = await fetch('/api/extract', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64, mimeType: 'image/jpeg', passcode: getStoredPasscode() }),
    });
    if (res.status === 401) {
      show('passcodeScreen');
      const pe = document.getElementById('passcodeError');
      pe.textContent = 'Wrong or missing passcode — try again.';
      pe.classList.remove('hidden');
      return;
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Extraction failed');
    fillReview(data.fields || {});
    show('reviewScreen');
  } catch (err) {
    fillReview({});
    show('reviewScreen');
    const re = document.getElementById('reviewError');
    re.textContent = 'Could not read the photo automatically (' + err.message + '). You can still fill this in by hand.';
    re.classList.remove('hidden');
  }
}

function fillReview(fields) {
  document.getElementById('f_deliveryDate').value = fields.deliveryDate || '';
  document.getElementById('f_stockNumber').value = fields.stockNumber || '';
  document.getElementById('f_customer').value = fields.customer || '';
  document.getElementById('f_salesRep').value = fields.salesRep || 'MO';
  document.getElementById('f_tradeTitleReceived').value = 'Yes';
  NUMERIC_KEYS.forEach(k => {
    const v = fields[k];
    document.getElementById('f_' + k).value = (v === null || v === undefined) ? '' : v;
  });
  document.getElementById('reviewError').classList.add('hidden');
  updateTotal();
}

function updateTotal() {
  let total = 0;
  NUMERIC_KEYS.forEach(k => {
    const v = parseFloat(document.getElementById('f_' + k).value);
    if (!isNaN(v)) total += v;
  });
  document.getElementById('computedTotal').textContent = total.toFixed(2);
}
NUMERIC_KEYS.forEach(k => document.getElementById('f_' + k).addEventListener('input', updateTotal));

document.getElementById('retakeBtn').onclick = () => show('captureScreen');

document.getElementById('confirmBtn').onclick = async () => {
  const btn = document.getElementById('confirmBtn');
  btn.disabled = true; btn.textContent = 'Adding…';
  const fields = {
    deliveryDate: document.getElementById('f_deliveryDate').value,
    stockNumber: document.getElementById('f_stockNumber').value,
    customer: document.getElementById('f_customer').value,
    salesRep: document.getElementById('f_salesRep').value,
    tradeTitleReceived: document.getElementById('f_tradeTitleReceived').value,
  };
  NUMERIC_KEYS.forEach(k => {
    const v = document.getElementById('f_' + k).value;
    fields[k] = v === '' ? null : parseFloat(v);
  });
  try {
    const res = await fetch('/api/append', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ fields, passcode: getStoredPasscode() }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add to spreadsheet');
    document.getElementById('successTotal').textContent = '$' + Number(data.totalPayout).toFixed(2);
    show('successScreen');
  } catch (err) {
    const re = document.getElementById('reviewError');
    re.textContent = err.message;
    re.classList.remove('hidden');
    show('reviewScreen');
  } finally {
    btn.disabled = false; btn.innerHTML = '&#9989; Add to Spreadsheet';
  }
};

document.getElementById('anotherBtn').onclick = () => show('captureScreen');

show('captureScreen');
</script>
</body>
</html>
