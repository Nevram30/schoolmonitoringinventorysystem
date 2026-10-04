import "server-only";

import { Resend } from "resend";

import { env } from "~/env";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Where the e-mail's login button points: the app's public address. Resolving the
 * absolute "/login" path keeps only the origin, so a base URL that already has a
 * path (e.g. "https://site/login") does not turn into "/login/login".
 */
export const loginUrl = () =>
  new URL("/login", env.APP_URL ?? env.NEXTAUTH_URL ?? "http://localhost:3000").toString();

export const isMailConfigured = () => Boolean(env.RESEND_API_KEY);

// Resend's shared test sender; it only delivers to the Resend account owner's address.
const DEFAULT_FROM = "School Property Monitoring System <onboarding@resend.dev>";

type WelcomeEmail = {
  to: string;
  name: string;
  idNumber: string;
  temporaryPassword: string;
};

/**
 * Sends a new account its login link and temporary password. Throws when Resend is
 * not configured or refuses the message, so the caller can tell the admin.
 */
export async function sendTemporaryPasswordEmail({
  to,
  name,
  idNumber,
  temporaryPassword,
}: WelcomeEmail) {
  if (!isMailConfigured()) {
    throw new Error("E-mail is not configured (RESEND_API_KEY is not set)");
  }

  const link = loginUrl();
  const appName = "School Property Monitoring System";

  const text = [
    `Hello ${name},`,
    "",
    `An account has been created for you on the ${appName}.`,
    "",
    `Login link: ${link}`,
    `ID number: ${idNumber}`,
    `Temporary password: ${temporaryPassword}`,
    "",
    "You will be asked to change this password after you sign in for the first time.",
    "If you were not expecting this e-mail, please contact your administrator.",
  ].join("\n");

  // A complete HTML document (doctype, lang, charset): bare fragments score worse with spam filters.
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your ${appName} account</title>
</head>
<body style="margin:0;padding:24px 16px;background:#ffffff">
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#111827">
    <h2 style="color:#155dfc;margin-bottom:4px">${appName}</h2>
    <p>Hello ${escapeHtml(name)},</p>
    <p>An account has been created for you. Use the details below to sign in.</p>
    <table style="border-collapse:collapse;margin:16px 0">
      <tr>
        <td style="padding:6px 12px 6px 0;color:#6b7280">ID number</td>
        <td style="padding:6px 0;font-weight:bold">${escapeHtml(idNumber)}</td>
      </tr>
      <tr>
        <td style="padding:6px 12px 6px 0;color:#6b7280">Temporary password</td>
        <td style="padding:6px 0;font-weight:bold;font-family:monospace;font-size:16px">${escapeHtml(temporaryPassword)}</td>
      </tr>
    </table>
    <p>
      <a href="${escapeHtml(link)}"
         style="display:inline-block;background:#155dfc;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-weight:bold">
        Log in
      </a>
    </p>
    <p style="font-size:13px;color:#6b7280">Or open this link: <a href="${escapeHtml(link)}">${escapeHtml(link)}</a></p>
    <p style="font-size:13px;color:#6b7280">
      You will be asked to change this password after you sign in for the first time.
      If you were not expecting this e-mail, please contact your administrator.
    </p>
  </div>
</body>
</html>`;

  // Resend reports failures in `error` rather than throwing.
  const { error } = await new Resend(env.RESEND_API_KEY).emails.send({
    from: env.EMAIL_FROM ?? DEFAULT_FROM,
    to,
    ...(env.EMAIL_REPLY_TO ? { replyTo: env.EMAIL_REPLY_TO } : {}),
    // Kept plain: words like "password" or "urgent" in a subject are a phishing signal.
    subject: `Welcome to the ${appName}`,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}
