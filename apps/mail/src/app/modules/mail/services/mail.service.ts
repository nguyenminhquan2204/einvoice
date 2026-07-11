import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { SendEmailOptions } from '@common/interfaces/common/email.interface';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('MAIL_CONFIG.HOST'),
      port: configService.get('MAIL_CONFIG.PORT'),
      secure: false,
      auth: {
        user: configService.get('MAIL_CONFIG.USER'),
        pass: configService.get('MAIL_CONFIG.PASS'),
      },
    });
  }

  async sendMail({ to, subject, html, text, senderName, senderEmail, attachments }: SendEmailOptions) {
    const defaultName = this.configService.get('MAIL_CONFIG.SENDER_NAME');
    const defaultEmail = this.configService.get('MAIL_CONFIG.SENDER_EMAIL');

    const mailOptions = {
      from: `"${senderName ?? defaultName}" <${senderEmail ?? defaultEmail}>`,
      to,
      subject,
      html,
      text: text ?? html!.replace(/<[^>]+>/g, ''),
      attachments,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`📄 Mail sent to ${to}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send mail to ${to}:`, error);
      throw error;
    }
  }
}
