import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const from = process.env.SMTP_FROM ?? 'Jacasoft <no-reply@jacasoft.test>';

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!process.env.SMTP_HOST) {
    console.info('[email] SMTP_HOST não configurado. E-mail seria enviado:', { to, subject });
    return;
  }
  await transporter.sendMail({ from, to, subject, html });
}

export function renderTemplate(name: string, variables: Record<string, string>) {
  switch (name) {
    case 'order-approved':
      return `<p>Olá ${variables.name},</p><p>O seu pedido ${variables.reference} foi aprovado. Obrigado!</p>`;
    case 'order-rejected':
      return `<p>Olá ${variables.name},</p><p>O seu pedido ${variables.reference} foi reprovado. Motivo: ${variables.reason}</p>`;
    default:
      return `<p>${variables.message ?? ''}</p>`;
  }
}
