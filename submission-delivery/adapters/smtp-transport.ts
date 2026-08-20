import { createTransport } from "nodemailer";
import type { EmailTransport } from "../ports";

export type SmtpOptions = {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
};

export const createSmtpTransport = (options: SmtpOptions): EmailTransport => {
  const transport = createTransport({
    host: options.host,
    port: options.port,
    secure: options.port === 465,
    auth: { user: options.user, pass: options.password },
  });

  return {
    send: async (message, signal) => {
      signal.throwIfAborted();
      await transport.sendMail({
        from: options.from,
        to: message.to,
        subject: message.subject,
        text: message.text,
        ...(message.replyTo ? { replyTo: message.replyTo } : {}),
      });
    },
  };
};
