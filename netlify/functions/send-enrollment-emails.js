"use strict";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_OWNER_EMAIL = "marian.dumitru@grupulverde.ro";
const DEFAULT_FROM_EMAIL = "admitere@academie.grupulverde.ro";
const DEFAULT_FROM_NAME = "NetAcad Adjud";

const MAX_BODY_LENGTH = 25_000;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 160;
const MAX_PHONE_LENGTH = 40;
const MAX_TEXT_LENGTH = 2_500;
const MAX_SOURCE_LENGTH = 120;
const MAX_URL_LENGTH = 300;

const FORM_MIN_FILL_MS = 2_000;
const FORM_MAX_AGE_MS = 8 * 60 * 60 * 1000;

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 8;
const rateStore = new Map();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\s().-]{7,40}$/;
const leadSourceRegex = /^[a-z0-9._-]{1,120}$/i;

const escapeHtml = (input) =>
  String(input || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");

const normalizeText = (value, maxLen) => String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLen);

const normalizeLongText = (value, maxLen) => String(value || "").trim().slice(0, maxLen);

const getHeader = (headers, name) => {
  if (!headers) return "";
  const key = Object.keys(headers).find((h) => h.toLowerCase() === name.toLowerCase());
  return key ? String(headers[key] || "") : "";
};

const getAllowedOrigins = () => {
  const configured = String(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const defaults = [
    "https://academie.grupulverde.ro",
    "https://academiacisco.netlify.app",
    "http://localhost:8888",
    "http://localhost:3000"
  ];
  return new Set([...defaults, ...configured]);
};

const originAllowed = (originValue, allowed) => {
  if (!originValue) return true;
  try {
    const origin = new URL(originValue).origin;
    return allowed.has(origin);
  } catch {
    return false;
  }
};

const isRateLimited = (ip) => {
  const now = Date.now();
  const key = ip || "unknown";
  const windowStart = now - RATE_WINDOW_MS;
  const entries = (rateStore.get(key) || []).filter((ts) => ts > windowStart);
  if (entries.length >= RATE_MAX_REQUESTS) {
    rateStore.set(key, entries);
    return true;
  }
  entries.push(now);
  rateStore.set(key, entries);
  return false;
};

const responseHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff"
};

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: responseHeaders,
  body: JSON.stringify(body)
});

const buildInternalEmail = (lead) => {
  const course = lead.curs_selectat || "Neselectat";
  const subject = `[Admitere NetAcad] Înscriere nouă: ${course} - ${lead.nume || "Cursant nou"}`;
  const html = `
    <h2>Înscriere nouă la curs</h2>
    <p>Ai primit o cerere nouă de admitere. Mai jos ai toate datele trimise din formular:</p>
    <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
      <tr><td><strong>Nume complet</strong></td><td>${escapeHtml(lead.nume)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(lead.email)}</td></tr>
      <tr><td><strong>Telefon</strong></td><td>${escapeHtml(lead.telefon)}</td></tr>
      <tr><td><strong>Curs selectat</strong></td><td>${escapeHtml(course)}</td></tr>
      <tr><td><strong>Nivel urmărit</strong></td><td>${escapeHtml(lead.nivel)}</td></tr>
      <tr><td><strong>Domeniu principal</strong></td><td>${escapeHtml(lead.domeniu)}</td></tr>
      <tr><td><strong>Sursa lead</strong></td><td>${escapeHtml(lead.lead_source)}</td></tr>
      <tr><td><strong>Pagină trimitere</strong></td><td>${escapeHtml(lead.page_url)}</td></tr>
      <tr><td><strong>Moment trimitere</strong></td><td>${escapeHtml(lead.sent_at)}</td></tr>
    </table>
    <h3 style="margin-top:18px;">Mesaj cursant</h3>
    <p style="white-space:pre-wrap;">${escapeHtml(lead.mesaj || "-")}</p>
  `;
  const text =
    `Înscriere nouă la curs\n\n` +
    `Nume: ${lead.nume}\n` +
    `Email: ${lead.email}\n` +
    `Telefon: ${lead.telefon}\n` +
    `Curs selectat: ${course}\n` +
    `Nivel urmărit: ${lead.nivel}\n` +
    `Domeniu principal: ${lead.domeniu}\n` +
    `Sursa lead: ${lead.lead_source}\n` +
    `Pagină trimitere: ${lead.page_url}\n` +
    `Moment trimitere: ${lead.sent_at}\n\n` +
    `Mesaj:\n${lead.mesaj || "-"}`;
  return { subject, html, text };
};

const buildApplicantEmail = (lead) => {
  const course = lead.curs_selectat || "programul selectat";
  const subject = `Confirmare înscriere - ${course} | NetAcad Adjud`;
  const html = `
    <p>Bună, ${escapeHtml(lead.nume || "viitor cursant")},</p>
    <p>Îți confirmăm primirea solicitării de înscriere pentru <strong>${escapeHtml(course)}</strong>.</p>
    <p>În maximum <strong>24-48h</strong> vei fi contactat de echipa academică pentru pașii următori.</p>
    <p>În răspunsul nostru vei primi informațiile complete despre:</p>
    <ul>
      <li>accesul în platforma de curs și activarea contului;</li>
      <li>costurile programului și opțiunile de plată;</li>
      <li>calendarul de desfășurare și ritmul recomandat;</li>
      <li>documentele/informațiile necesare pentru finalizarea înscrierii.</li>
    </ul>
    <p>Dacă dorești completări rapide, ne poți contacta direct:</p>
    <p>
      Email: <a href="mailto:marian.dumitru@grupulverde.ro">marian.dumitru@grupulverde.ro</a><br>
      Telefon: <a href="tel:+40374962748">+40 (0374) 962 748</a>
    </p>
    <p>Cu respect,</p>
    <p>
      <strong>Instructor CISCO Academy</strong><br>
      <strong>Marian DUMITRU</strong><br>
      NetAcad Adjud
    </p>
  `;
  const text =
    `Bună, ${lead.nume || "viitor cursant"},\n\n` +
    `Îți confirmăm primirea solicitării de înscriere pentru ${course}.\n` +
    `În maximum 24-48h vei fi contactat de echipa academică pentru pașii următori.\n\n` +
    `Vei primi informațiile complete despre:\n` +
    `- accesul în platformă;\n` +
    `- costuri și opțiuni de plată;\n` +
    `- calendarul de curs;\n` +
    `- documentele necesare.\n\n` +
    `Contact:\n` +
    `Email: marian.dumitru@grupulverde.ro\n` +
    `Telefon: +40 (0374) 962 748\n\n` +
    `Cu respect,\nInstructor CISCO Academy\nMarian DUMITRU\nNetAcad Adjud`;
  return { subject, html, text };
};

const sendEmail = async (apiKey, message) => {
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend error (${response.status}): ${body}`);
  }
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method Not Allowed" });
  }

  if ((event.body || "").length > MAX_BODY_LENGTH) {
    return jsonResponse(413, { error: "Payload too large" });
  }

  const contentType = getHeader(event.headers, "content-type");
  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonResponse(415, { error: "Unsupported Media Type" });
  }

  const ip = getHeader(event.headers, "x-nf-client-connection-ip") || getHeader(event.headers, "x-forwarded-for").split(",")[0].trim();
  if (isRateLimited(ip)) {
    return jsonResponse(429, { error: "Too Many Requests" });
  }

  const allowedOrigins = getAllowedOrigins();
  const origin = getHeader(event.headers, "origin");
  const referer = getHeader(event.headers, "referer");
  const forwardedHost = getHeader(event.headers, "x-forwarded-host");
  const host = getHeader(event.headers, "host");
  const requestHost = forwardedHost || host;
  if (requestHost) {
    allowedOrigins.add(`https://${requestHost}`);
    allowedOrigins.add(`http://${requestHost}`);
  }
  const secFetchSite = getHeader(event.headers, "sec-fetch-site").toLowerCase();
  if (secFetchSite && secFetchSite !== "same-origin" && secFetchSite !== "same-site") {
    return jsonResponse(403, { error: "Forbidden request context" });
  }
  if (!origin && !referer) {
    return jsonResponse(403, { error: "Missing origin metadata" });
  }
  if (!originAllowed(origin, allowedOrigins) || !originAllowed(referer, allowedOrigins)) {
    return jsonResponse(403, { error: "Forbidden origin" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.ENROLLMENT_OWNER_EMAIL || DEFAULT_OWNER_EMAIL;
  const fromEmail = process.env.ENROLLMENT_FROM_EMAIL || DEFAULT_FROM_EMAIL;
  const fromName = process.env.ENROLLMENT_FROM_NAME || DEFAULT_FROM_NAME;
  const from = `${fromName} <${fromEmail}>`;

  if (!apiKey) {
    return jsonResponse(500, { error: "Email service is not configured" });
  }

  let rawLead;
  try {
    rawLead = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid JSON payload" });
  }

  const honeypot = normalizeText(rawLead.company, 100);
  if (honeypot) {
    return jsonResponse(200, { ok: true });
  }

  const now = Date.now();
  const startedAt = Date.parse(rawLead.form_started_at || "");
  if (!Number.isFinite(startedAt) || now - startedAt < FORM_MIN_FILL_MS || now - startedAt > FORM_MAX_AGE_MS) {
    return jsonResponse(400, { error: "Invalid form timing" });
  }

  const lead = {
    nume: normalizeText(rawLead.nume, MAX_NAME_LENGTH),
    email: normalizeText(rawLead.email, MAX_EMAIL_LENGTH).toLowerCase(),
    telefon: normalizeText(rawLead.telefon, MAX_PHONE_LENGTH),
    nivel: normalizeText(rawLead.nivel, 60),
    domeniu: normalizeText(rawLead.domeniu, 80),
    curs_selectat: normalizeText(rawLead.curs_selectat, 180),
    mesaj: normalizeLongText(rawLead.mesaj, MAX_TEXT_LENGTH),
    lead_source: normalizeText(rawLead.lead_source, MAX_SOURCE_LENGTH),
    page_url: normalizeText(rawLead.page_url, MAX_URL_LENGTH),
    sent_at: new Date().toISOString()
  };

  if (!lead.nume || !lead.email || !lead.telefon) {
    return jsonResponse(400, { error: "Missing required fields: nume/email/telefon" });
  }

  if (!emailRegex.test(lead.email)) {
    return jsonResponse(400, { error: "Invalid email format" });
  }

  if (!phoneRegex.test(lead.telefon)) {
    return jsonResponse(400, { error: "Invalid phone format" });
  }

  if (lead.lead_source && !leadSourceRegex.test(lead.lead_source)) {
    return jsonResponse(400, { error: "Invalid source format" });
  }

  if (lead.page_url) {
    try {
      const parsed = new URL(lead.page_url);
      if (!allowedOrigins.has(parsed.origin)) {
        return jsonResponse(400, { error: "Invalid page URL origin" });
      }
    } catch {
      return jsonResponse(400, { error: "Invalid page URL" });
    }
  }

  const internal = buildInternalEmail(lead);
  const applicant = buildApplicantEmail(lead);

  try {
    await Promise.all([
      sendEmail(apiKey, {
        from,
        to: [ownerEmail],
        reply_to: lead.email,
        subject: internal.subject,
        html: internal.html,
        text: internal.text
      }),
      sendEmail(apiKey, {
        from,
        to: [lead.email],
        reply_to: ownerEmail,
        subject: applicant.subject,
        html: applicant.html,
        text: applicant.text
      })
    ]);

    return jsonResponse(200, { ok: true });
  } catch (error) {
    console.error("Enrollment email dispatch failed", {
      message: String(error && error.message ? error.message : error),
      name: String(error && error.name ? error.name : ""),
      ownerEmail,
      applicantEmail: lead.email
    });
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify({ error: "Failed to send enrollment emails" })
    };
  }
};
