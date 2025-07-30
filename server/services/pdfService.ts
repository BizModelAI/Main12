import { chromium, Browser, Page } from 'playwright';

interface PDFGenerationData {
  quizData: any;
  userEmail: string;
  aiAnalysis: any;
  topBusinessPath: any;
  businessScores?: any[];
  baseUrl: string;
}

class PDFService {
  private browser: Browser | null = null;

  async initializeBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
    }
  }

  async generatePDF(data: PDFGenerationData): Promise<Buffer> {
    await this.initializeBrowser();
    
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    const page = await this.browser.newPage();
    
    try {
      // Prepare the data for the PDF report page
      const reportData = {
        quizData: data.quizData,
        userEmail: data.userEmail,
        aiAnalysis: data.aiAnalysis,
        topBusinessPath: data.topBusinessPath,
        businessScores: data.businessScores
      };

      // Encode data for URL
      const jsonString = JSON.stringify(reportData);
      const base64Data = Buffer.from(jsonString).toString('base64');
      const encodedData = encodeURIComponent(`data:application/json;base64,${base64Data}`);

      // Navigate to the PDF report page
      const pdfReportUrl = `${data.baseUrl}/pdf-report?data=${encodedData}`;
      await page.goto(pdfReportUrl, { waitUntil: 'networkidle' });

      // Generate PDF with better page break handling
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.75in',
          right: '0.75in',
          bottom: '0.75in',
          left: '0.75in'
        },
        preferCSSPageSize: true
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await page.close();
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const pdfService = new PDFService(); 