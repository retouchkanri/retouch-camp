import "server-only";
import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM || "Retouch Horse Garden <no-reply@example.jp>";

/**
 * Sends an email via Resend when RESEND_API_KEY is configured; otherwise logs and
 * no-ops. Every caller in this app treats email as best-effort — a missing key
 * must never block a booking/survey/contact submission from succeeding.
 */
export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[email disabled] to=${opts.to} subject="${opts.subject}"`);
    return { sent: false as const };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({ from: FROM, to: opts.to, subject: opts.subject, html: opts.html });
    return { sent: true as const };
  } catch (err) {
    console.error("sendEmail failed", err);
    return { sent: false as const };
  }
}

export function emailLayout(title: string, bodyHtml: string) {
  return `<!doctype html>
<html lang="ja"><body style="font-family:'Hiragino Sans',sans-serif;background:#ffffff;padding:32px;color:#2b2620;">
  <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #f2f6f2;border-radius:16px;overflow:hidden;">
    <div style="background:#2f4536;color:#ffffff;padding:24px 32px;">
      <p style="margin:0;font-size:12px;letter-spacing:0.1em;color:#3f8a4a;">RETOUCH HORSE GARDEN</p>
      <h1 style="margin:8px 0 0;font-size:20px;">${title}</h1>
    </div>
    <div style="padding:32px;font-size:14px;line-height:1.8;">${bodyHtml}</div>
  </div>
</body></html>`;
}
