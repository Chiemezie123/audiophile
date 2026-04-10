import nodemailer from "nodemailer";

type OtpMailInput = {
  email: string;
  otp: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for email delivery.`);
  }

  return value;
}

function getTransport() {
  const host = getRequiredEnv("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT || "587");
  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASS");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

export function getMailerDebugConfig() {
  return {
    host: process.env.SMTP_HOST || null,
    port: process.env.SMTP_PORT || "587",
    secure:
      process.env.SMTP_SECURE === "true" ||
      Number(process.env.SMTP_PORT || "587") === 465,
    userPresent: Boolean(process.env.SMTP_USER),
    passPresent: Boolean(process.env.SMTP_PASS),
    fromEmail: process.env.SMTP_FROM_EMAIL || null,
    fromName: process.env.SMTP_FROM_NAME || "FuzzyBeats",
  };
}

function buildOtpHtml(otp: string) {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f7f3ec;padding:32px;color:#111215;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #ece7df;">
        <div style="padding:28px 32px;background:#111215;color:#ffffff;">
          <div style="font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:#d87d4a;font-weight:700;">
            FuzzyBeats
          </div>
          <h1 style="margin:16px 0 0;font-size:28px;line-height:1.2;">
            Verify your email
          </h1>
        </div>
        <div style="padding:32px;">
          <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#4a4f59;">
            Use the one-time password below to continue creating your FuzzyBeats account.
          </p>
          <div style="margin:24px 0;padding:18px 20px;border-radius:16px;background:#f4efe8;text-align:center;">
            <div style="font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#8a8f99;margin-bottom:10px;">
              Your OTP code
            </div>
            <div style="font-size:34px;font-weight:800;letter-spacing:0.32em;color:#111215;">
              ${otp}
            </div>
          </div>
          <p style="margin:0;font-size:14px;line-height:1.7;color:#6a707c;">
            This code expires in 10 minutes. If you did not request this, you can ignore this email.
          </p>
        </div>
      </div>
    </div>
  `;
}

export async function sendOtpEmail({ email, otp }: OtpMailInput) {
  const transporter = getTransport();
  const fromEmail = getRequiredEnv("SMTP_FROM_EMAIL");
  const fromName = process.env.SMTP_FROM_NAME || "FuzzyBeats";

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: email,
    subject: "Your FuzzyBeats verification code",
    text: `Your FuzzyBeats verification code is ${otp}. It expires in 10 minutes.`,
    html: buildOtpHtml(otp),
  });
}
