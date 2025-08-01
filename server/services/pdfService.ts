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
  private isInitializing: boolean = false;

  async initializeBrowser(): Promise<void> {
    // Prevent multiple simultaneous initializations
    if (this.isInitializing) {
      while (this.isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    if (!this.browser) {
      this.isInitializing = true;
      try {
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
        console.log('PDF Service: Browser initialized successfully');
      } catch (error) {
        console.error('PDF Service: Failed to initialize browser:', error);
        throw error;
      } finally {
        this.isInitializing = false;
      }
    }
  }

  async generatePDF(data: PDFGenerationData): Promise<Buffer> {
    let page: Page | null = null;
    
    try {
      await this.initializeBrowser();
      
      if (!this.browser) {
        throw new Error('Browser not initialized');
      }

      // Check if browser is still connected
      if (this.browser && this.browser.isConnected()) {
        page = await this.browser.newPage();
      } else {
        // Browser was closed, reinitialize
        console.log('PDF Service: Browser disconnected, reinitializing...');
        this.browser = null;
        await this.initializeBrowser();
        if (!this.browser) {
          throw new Error('Failed to reinitialize browser');
        }
        // At this point, this.browser is guaranteed to be non-null
        const browser = this.browser as Browser;
        page = await browser.newPage();
      }

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

      // Navigate to the PDF report page with timeout
      const pdfReportUrl = `${data.baseUrl}/pdf-report?data=${encodedData}`;
      if (!page) {
        throw new Error('Failed to create browser page');
      }
      await page.goto(pdfReportUrl, { 
        waitUntil: 'networkidle',
        timeout: 25000 // 25 second timeout
      });

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

      console.log('PDF Service: PDF generated successfully, size:', pdfBuffer.length);
      return Buffer.from(pdfBuffer);
    } catch (error) {
      console.error('PDF Service: Error generating PDF:', error);
      
      // If browser error, reset browser instance
      if (error instanceof Error && error.message.includes('browser')) {
        console.log('PDF Service: Resetting browser due to error');
        this.browser = null;
      }
      
      throw error;
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (closeError) {
          console.error('PDF Service: Error closing page:', closeError);
        }
      }
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