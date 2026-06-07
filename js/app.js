// ============================================================
// NOVUS CYCLE COUNT — SHARED UTILITIES
// js/app.js
// ============================================================

const SUPABASE_URL  = 'https://fcaluuhfmexzeykxhcgp.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjYWx1dWhmbWV4emV5a3hoY2dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwOTg3MjIsImV4cCI6MjA5MzY3NDcyMn0.mSzLJnWzPVTQcGGhimK2uWTEdtUzL1KJ63XTcQYLouY';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Auth guard ───────────────────────────────────────────────
// Call at the top of every protected page.
async function requireAuth() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

// ── Current user profile ─────────────────────────────────────
async function getCurrentProfile() {
  const { data: { user } } = await db.auth.getUser();
  if (!user) return null;
  const { data } = await db.from('profiles').select('*').eq('id', user.id).single();
  return data;
}

// ── Toast notifications ──────────────────────────────────────
function toast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  container.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

// ── Format date ──────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true
  });
}

// ── Polling helper ───────────────────────────────────────────
async function pollUntil(fn, intervalMs = 2000, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const result = await fn();
    if (result) return result;
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error('Polling timed out — check SAP connection');
}

// ── SAP stub layer ───────────────────────────────────────────
// Every SAP call lives here. Nothing else needs to change
// when you wire in real endpoints — just replace the bodies below.

const SAP = {

  // GET: bins containing a material number
  // Returns: [{ bin, material_number, material_desc, expected_qty, uom }]
  async getBinsByMaterial(materialNumber) {
    console.log('[SAP] getBinsByMaterial →', materialNumber);
    // TODO: replace with real EWM GET call
    await new Promise(r => setTimeout(r, 900));
    return [
      { bin: 'WH-A-01-01', material_number: materialNumber, material_desc: 'SALSA ROJA 16OZ', expected_qty: 144, uom: 'CS' },
      { bin: 'WH-A-01-02', material_number: materialNumber, material_desc: 'SALSA ROJA 16OZ', expected_qty:  72, uom: 'CS' },
      { bin: 'WH-B-02-01', material_number: materialNumber, material_desc: 'SALSA ROJA 16OZ', expected_qty:  96, uom: 'CS' },
    ];
  },

  // GET: live bin contents at moment counter taps "I'm at this bin"
  // Returns: { bin, material_number, material_desc, expected_qty, uom }
  async getLiveBinContents(bin, materialNumber) {
    console.log('[SAP] getLiveBinContents →', bin, materialNumber);
    // TODO: replace with real EWM GET call
    await new Promise(r => setTimeout(r, 700));
    return { bin, material_number: materialNumber, material_desc: 'SALSA ROJA 16OZ', expected_qty: 144, uom: 'CS' };
  },

  // POST: create + activate PI document
  // Returns: { pi_doc_number }
  async createAndActivatePIDoc(bin, materialNumber, expectedQty) {
    console.log('[SAP] createAndActivatePIDoc →', bin, materialNumber, expectedQty);
    // TODO: replace with real /SCWM/PI_DOC_CREATE call
    await new Promise(r => setTimeout(r, 1200));
    return { pi_doc_number: `PI-${Date.now()}` };
  },

  // POLL: wait for EWM to generate warehouse order from PI doc
  // Returns: { wo_number }
  async waitForWarehouseOrder(piDocNumber) {
    console.log('[SAP] waitForWarehouseOrder →', piDocNumber);
    // TODO: replace with real EWM polling call
    await new Promise(r => setTimeout(r, 1500));
    return { wo_number: `WO-${Date.now()}` };
  },

  // POST: confirm WO + post PI document with actual count
  // Returns: { success: true }
  async confirmAndPost(woNumber, piDocNumber, actualQty) {
    console.log('[SAP] confirmAndPost →', woNumber, piDocNumber, actualQty);
    // TODO: replace with real /SCWM/TO_CONF + /SCWM/PI_POST calls
    await new Promise(r => setTimeout(r, 1000));
    return { success: true };
  },
};
