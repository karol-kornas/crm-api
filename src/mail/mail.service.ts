import nodemailer from "nodemailer";
import { MAIL_FROM } from "@/config";
import { IUser } from "@/types/user";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  text?: string;
}

let transporter: nodemailer.Transporter | null = null;

export const initMailer = async () => {
  if (process.env.NODE_ENV === "development") {
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log("Mailer initialized with Ethereal (dev mode)");
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log("Mailer initialized with SMTP (prod)");
  }
};

export const sendMail = async (options: SendMailOptions) => {
  if (!transporter) {
    throw new Error("Mailer not initialized.");
  }

  const mailOptions = {
    from: options.from || MAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent:", info.messageId);

  if (nodemailer.getTestMessageUrl(info)) {
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  }

  return info;
};

export const sendVerificationEmail = async (user: IUser) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${user.email_verification_token}`;

  const html = `
    <p>Cześć ${user.first_name},</p>
    <p>Dziękujemy za rejestrację. Kliknij w link poniżej, aby zweryfikować swój adres e-mail:</p>
    <p><a href="${verifyUrl}">Zweryfikuj email</a></p>
    <p>Link wygaśnie za 1 godzinę.</p>
  `;
  try {
    await sendMail({
      to: user.email,
      html,
      subject: "Zweryfikuj swój e-mail",
      text: "Zweryfikuj email klikając w ten link: " + verifyUrl,
    });
  } catch (err) {
    console.error("Failed send e-mail:", err);
  }
};

export const sendResetPasswordEmail = async (user: IUser) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${user.password_reset_token}`;

  const html = `
  <p>Cześć ${user.first_name},</p>
  <p>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta.</p>
  <p>Kliknij w link poniżej, aby ustawić nowe hasło:</p>
  <p><a href="${resetUrl}">Zresetuj hasło</a></p>
  <p>Link wygaśnie za 1 godzinę.</p>
  <p>Jeśli to nie Ty wysłałeś tę prośbę, zignoruj tę wiadomość.</p>
`;
  try {
    await sendMail({
      to: user.email,
      html,
      subject: "Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta",
      text: "Ustaw nowe hasło klikając w ten link: " + resetUrl,
    });
  } catch (err) {
    console.error("Failed send e-mail:", err);
  }
};
