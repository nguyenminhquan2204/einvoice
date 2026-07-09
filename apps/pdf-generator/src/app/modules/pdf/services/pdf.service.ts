import { Injectable, NotFoundException } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async renderEjsTemplate(templatePath: string, data: any) {
    const fullPath = path.resolve(templatePath);
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException(`Template not found: ${templatePath}`);
    }
    return await ejs.renderFile(fullPath, data);
  }

  async generatePdfFromHtml(html: string): Promise<Uint8Array<ArrayBufferLike>> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
    return pdfBuffer;
  }

  async generatePdfFromEjs(templatePath: string, data: any) {
    const html = await this.renderEjsTemplate(templatePath, data);
    return this.generatePdfFromHtml(html as string);
  }
}
