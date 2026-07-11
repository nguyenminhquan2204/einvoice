export type MailAttachment = {
  fileName: string;
  content?: Buffer | string;
  contentType?: string;
  path?: string;
};

export interface SendEmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  senderName?: string;
  senderEmail?: string;
  attachments?: MailAttachment[];
}
