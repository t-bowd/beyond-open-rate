const BREVO_API = "https://api.brevo.com/v3/smtp/email";
const FROM_LEADS = { name: "Beyond Open Rate", email: "leads@ops.beyondopenrate.com.au" };
const FROM_HELLO = { name: "Beyond Open Rate", email: "hello@again.beyondopenrate.com.au" };
const REPLY_TO = { name: "Tim Bowman", email: "tim@timbowman.com.au" };
const NOTIFY_TO = "tim@timbowman.com.au";
const SITE = "https://beyondopenrate.com.au";

// ── Brevo send helper ─────────────────────────────────────────────────────────

async function sendEmail({
  to,
  from,
  subject,
  htmlContent,
}: {
  to: string;
  from: { name: string; email: string };
  subject: string;
  htmlContent: string;
}): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY env var is missing");

  const res = await fetch(BREVO_API, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: from,
      to: [{ email: to }],
      replyTo: REPLY_TO,
      subject,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Brevo send failed (${res.status}): ${text}`);
  }
}

// ── Notification email to Tim ─────────────────────────────────────────────────

export type NotifyLeadInput = {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  website?: string | null;
  company?: string | null;
  company_size?: string | null;
  message?: string | null;
  source: string;
  payload?: Record<string, unknown>;
};

function row(label: string, value: string | null | undefined) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:8px 16px 8px 0;font-size:13px;font-weight:600;color:#666;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;font-size:14px;color:#111;vertical-align:top;">${value}</td>
    </tr>`;
}

function auditSection(payload: Record<string, unknown> | undefined): string {
  if (!payload || Object.keys(payload).length === 0) return "";

  const score = payload.score as number | undefined;
  const maxScore = payload.maxScore as number | undefined;
  const tier = payload.tier as string | undefined;
  const answers = payload.answers as Record<string, unknown> | undefined;

  let html = `
    <div style="margin-top:24px;background:#f5f0ff;border:1px solid #d8b4fe;border-radius:8px;padding:20px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#6A00CC;text-transform:uppercase;letter-spacing:0.5px;">Email Audit Results</p>`;

  if (score !== undefined && maxScore !== undefined) {
    const pct = Math.round((score / maxScore) * 100);
    html += `<p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111;">${score}/${maxScore} <span style="font-size:15px;color:#666;">(${pct}% — ${tier ?? ""})</span></p>`;
  }

  if (answers && typeof answers === "object") {
    html += `<table cellpadding="0" cellspacing="0" style="margin-top:12px;width:100%;border-top:1px solid #e9d5ff;">`;
    for (const [q, a] of Object.entries(answers)) {
      html += `
        <tr>
          <td style="padding:8px 12px 8px 0;font-size:12px;color:#555;vertical-align:top;width:55%;border-bottom:1px solid #f3e8ff;">${q}</td>
          <td style="padding:8px 0;font-size:12px;font-weight:600;color:#111;vertical-align:top;border-bottom:1px solid #f3e8ff;">${String(a)}</td>
        </tr>`;
    }
    html += `</table>`;
  }

  html += `</div>`;
  return html;
}

export async function sendLeadNotification(lead: NotifyLeadInput): Promise<void> {
  const subject = `New lead: ${lead.name ?? lead.email}${lead.source === "tool:email-audit" ? " (completed audit)" : ""}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 20px;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">
          <tr>
            <td style="background:#6A00CC;padding:20px 32px;border-radius:8px 8px 0 0;">
              <p style="margin:0;font-size:13px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:1px;">Beyond Open Rate — New Lead</p>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:32px;border-radius:0 0 8px 8px;">
              <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#111;">${lead.name ?? lead.email}</h1>

              <table cellpadding="0" cellspacing="0" style="border-top:1px solid #eee;width:100%;">
                ${row("Email", `<a href="mailto:${lead.email}" style="color:#6A00CC;">${lead.email}</a>`)}
                ${row("Name", lead.name)}
                ${row("Phone", lead.phone)}
                ${row("Company", lead.company)}
                ${row("Company size", lead.company_size)}
                ${row("Website", lead.website ? `<a href="${lead.website}" style="color:#6A00CC;">${lead.website}</a>` : null)}
                ${row("Source", lead.source)}
                ${row("Lead ID", lead.id)}
              </table>

              ${lead.message ? `
              <div style="margin-top:20px;background:#f9f9f9;border-left:3px solid #6A00CC;padding:16px;border-radius:0 6px 6px 0;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#666;text-transform:uppercase;">Message</p>
                <p style="margin:0;font-size:14px;color:#111;line-height:1.6;">${lead.message.replace(/\n/g, "<br>")}</p>
              </div>` : ""}

              ${auditSection(lead.payload)}

              <div style="margin-top:24px;text-align:center;">
                <a href="mailto:${lead.email}" style="display:inline-block;background:#6A00CC;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:6px;">Reply to ${lead.name?.split(" ")[0] ?? "lead"} →</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await sendEmail({ to: NOTIFY_TO, from: FROM_LEADS, subject, htmlContent: html });
}

// ── Confirmation email to the lead ────────────────────────────────────────────

export type ConfirmLeadInput = {
  email: string;
  name?: string | null;
  source: string;
  auditCompleted?: boolean;
};

export async function sendLeadConfirmation(lead: ConfirmLeadInput): Promise<void> {
  const firstName = lead.name?.split(" ")[0] ?? null;
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";
  const auditCompleted = lead.auditCompleted ?? lead.source === "tool:email-audit";

  const subject = "We've received your enquiry — a few things to explore while you wait";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>We'll be in touch</title>
</head>
<body style="margin:0;padding:0;background:#f0f0f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f0f0f2;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#ffffff;padding:28px 40px 24px;border-radius:12px 12px 0 0;border-bottom:1px solid #eeeeee;" align="center">
              <a href="${SITE}" style="text-decoration:none;display:inline-flex;align-items:center;gap:12px;">
                <img src="${SITE}/favicon.png" alt="Beyond Open Rate" width="32" height="32" style="display:block;width:32px;height:32px;" />
                <span style="font-size:18px;font-weight:700;color:#111111;letter-spacing:-0.4px;">Beyond&nbsp;Open&nbsp;Rate</span>
              </a>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px 40px 32px;">

              <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#111111;letter-spacing:-0.5px;">We'll be in touch shortly.</h1>
              <p style="margin:0 0 24px;font-size:16px;color:#555555;line-height:1.65;">${greeting} Thanks for reaching out. We'll review your details and get back to you within one business day.</p>

              ${auditCompleted ? `
              <p style="margin:0 0 32px;font-size:16px;color:#555555;line-height:1.65;">In the meantime, here are a few resources worth exploring while you wait.</p>
              ` : `
              <p style="margin:0 0 32px;font-size:16px;color:#555555;line-height:1.65;">While you wait, it's worth taking our free email program audit — answer 15 questions and get an instant score across deliverability, automation, segmentation, and copy. We'll be able to reference your results when we chat.</p>
              `}

              ${!auditCompleted ? `
              <!-- Audit CTA — prominent if they haven't done it -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
                <tr>
                  <td style="background:linear-gradient(135deg,#6A00CC,#8b2be2);border-radius:10px;padding:28px 28px 24px;">
                    <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.75);text-transform:uppercase;letter-spacing:0.8px;">Free tool</p>
                    <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">Score your email program</p>
                    <p style="margin:0 0 20px;font-size:14px;color:rgba(255,255,255,0.85);line-height:1.55;">15 questions. Instant score. Covers deliverability, automation, segmentation, and copy — the four things that actually drive revenue from email.</p>
                    <a href="${SITE}/tools/email-audit" style="display:inline-block;background:#ffffff;color:#6A00CC;text-decoration:none;font-size:14px;font-weight:700;padding:12px 24px;border-radius:6px;">Take the free audit →</a>
                  </td>
                </tr>
              </table>
              ` : ""}

              <!-- Blog CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
                <tr>
                  <td style="background:#f9f9fb;border:1px solid #e5e5e8;border-radius:10px;padding:24px 28px;">
                    <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;">Resources</p>
                    <p style="margin:0 0 8px;font-size:18px;font-weight:700;color:#111111;letter-spacing:-0.3px;">Strategy, automation &amp; deliverability</p>
                    <p style="margin:0 0 16px;font-size:14px;color:#555555;line-height:1.55;">Practical thinking on lifecycle flows, segmentation, Klaviyo, and the metrics that actually move revenue — written for Australian e-commerce brands.</p>
                    <a href="${SITE}/blog" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:6px;">Read the blog →</a>
                  </td>
                </tr>
              </table>

              ${auditCompleted ? `
              <!-- Audit CTA — secondary if they've done it -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
                <tr>
                  <td style="background:#f5f0ff;border:1px solid #e9d5ff;border-radius:10px;padding:24px 28px;">
                    <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#6A00CC;text-transform:uppercase;letter-spacing:0.8px;">Our services</p>
                    <p style="margin:0 0 8px;font-size:18px;font-weight:700;color:#111111;letter-spacing:-0.3px;">See how we can help</p>
                    <p style="margin:0 0 16px;font-size:14px;color:#555555;line-height:1.55;">From Klaviyo management and lifecycle automation to deliverability fixes and platform migrations — take a look at what we do.</p>
                    <a href="${SITE}/services" style="display:inline-block;background:#6A00CC;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:6px;">View services →</a>
                  </td>
                </tr>
              </table>
              ` : ""}

              <p style="margin:32px 0 0;font-size:14px;color:#888888;line-height:1.6;">If you have anything to add before we chat, just reply to this email — it comes straight to us.</p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f5f5f7;padding:20px 40px;border-radius:0 0 12px 12px;border-top:1px solid #e5e5e8;" align="center">
              <p style="margin:0 0 4px;font-size:12px;color:#999999;">Beyond Open Rate · <a href="${SITE}" style="color:#999;text-decoration:none;">beyondopenrate.com.au</a></p>
              <p style="margin:0;font-size:12px;color:#bbbbbb;">You received this because you submitted an enquiry on our website.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  await sendEmail({ to: lead.email, from: FROM_HELLO, subject, htmlContent: html });
}
