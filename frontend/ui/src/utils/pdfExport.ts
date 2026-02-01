/**
 * PDF Export Utility for Vantage Reports
 * Uses html2pdf.js to generate PDFs from HTML content
 */

export interface PDFReportData {
  businessType?: string;
  targetDemo?: string;
  budget?: number;
  location: {
    name: string;
    score: number;
    confidence: string;
    metrics: Array<{ label: string; score: number; confidence: string }>;
    competitors: Array<{ name: string; rating?: number; distance: string; weakness: string }>;
    revenue: Array<{ scenario: string; monthly: string; annual: string; margin: string }>;
  };
  generatedAt: string;
}

export const exportToPDF = async (data: PDFReportData) => {
  try {
    // Dynamic import to avoid loading the library if not needed
    const html2pdf = (await import('html2pdf.js')).default;

    // Create HTML content for PDF
    const htmlContent = generatePDFHTML(data);

    // Create a temporary element with proper styling for rendering
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    element.style.width = '8.5in';
    element.style.minHeight = '11in';
    element.style.padding = '40px';
    element.style.fontFamily = 'Inter, sans-serif';
    element.style.position = 'fixed';
    element.style.left = '0';
    element.style.top = '0';
    element.style.backgroundColor = '#ffffff';
    element.style.color = '#000000';
    element.style.zIndex = '99999';
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    element.style.display = 'block';
    element.style.overflow = 'visible';
    element.id = 'pdf-export-element';
    document.body.appendChild(element);

    // Force a reflow to ensure element is rendered
    element.offsetHeight;
    
    // Wait for fonts and images to load, and ensure element is rendered
    await new Promise(resolve => setTimeout(resolve, 2000));

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `Vantage_Report_${data.location.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 816,
        windowHeight: 1056,
        allowTaint: true,
        onclone: (clonedDoc: Document) => {
          // Ensure cloned document has visible content
          const clonedElement = clonedDoc.querySelector('body > div');
          if (clonedElement) {
            const htmlEl = clonedElement as HTMLElement;
            htmlEl.style.visibility = 'visible';
            htmlEl.style.opacity = '1';
            htmlEl.style.display = 'block';
            htmlEl.style.position = 'relative';
            htmlEl.style.width = '8.5in';
            htmlEl.style.minHeight = '11in';
            htmlEl.style.backgroundColor = '#ffffff';
            htmlEl.style.color = '#000000';
            // Ensure all text is visible
            const allText = clonedDoc.querySelectorAll('p, div, span, h1, h2, h3, h4, li');
            allText.forEach((el) => {
              const htmlElement = el as HTMLElement;
              htmlElement.style.color = '#000000';
              htmlElement.style.visibility = 'visible';
              htmlElement.style.opacity = '1';
            });
          }
        }
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    await html2pdf().set(opt).from(element).save();
    
    // Clean up
    if (document.body.contains(element)) {
      document.body.removeChild(element);
    }
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

const generatePDFHTML = (data: PDFReportData): string => {
  const metricsHTML = data.location.metrics.map(m => 
    `• ${m.label}: ${m.score}/100 (${m.confidence})`
  ).join('<br>');

  const competitorsHTML = data.location.competitors.map(c => 
    `• ${c.name}${c.rating ? ` (${c.rating}★)` : ''}, ${c.distance} - ${c.weakness}`
  ).join('<br>');

  const revenueHTML = data.location.revenue.map(r => 
    `${r.scenario}: ${r.monthly}/mo (${r.annual}/yr) - ${r.margin} margin`
  ).join('<br>');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          color: #111827;
          line-height: 1.6;
          padding: 40px;
          margin: 0;
          width: 100%;
          min-height: 100vh;
        }
        * {
          box-sizing: border-box;
        }
        p, div, span {
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .header {
          border-bottom: 3px solid #F59E0B;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #92400E;
          font-size: 32px;
          font-weight: 900;
          margin: 0 0 10px 0;
        }
        .header p {
          color: #6B7280;
          font-size: 14px;
          margin: 0;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          color: #92400E;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 15px;
          border-left: 4px solid #F59E0B;
          padding-left: 10px;
        }
        .highlight-box {
          background: linear-gradient(135deg, #FEF3C7, #FDE68A);
          border: 2px solid #F59E0B;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .score {
          font-size: 48px;
          font-weight: 900;
          color: #D97706;
          margin: 10px 0;
        }
        .confidence {
          display: inline-block;
          background: #10B981;
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .metrics, .competitors, .revenue {
          background: #F9FAFB;
          border-left: 3px solid #F59E0B;
          padding: 15px;
          margin: 10px 0;
          border-radius: 4px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        h1, h2, h3, h4 {
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #E5E7EB;
          text-align: center;
          color: #6B7280;
          font-size: 12px;
        }
        .data-source {
          font-size: 11px;
          color: #9CA3AF;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #E5E7EB;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>VANTAGE LOCATION INTELLIGENCE REPORT</h1>
        <p>Generated: ${data.generatedAt}</p>
      </div>

      ${data.businessType || data.targetDemo || data.budget ? `
      <div class="section">
        <div class="section-title">BUSINESS PROFILE</div>
        ${data.businessType ? `<p><strong>Business Type:</strong> ${data.businessType}</p>` : ''}
        ${data.targetDemo ? `<p><strong>Target Demographic:</strong> ${data.targetDemo}</p>` : ''}
        ${data.budget ? `<p><strong>Monthly Budget:</strong> $${data.budget.toLocaleString()}</p>` : ''}
      </div>
      ` : ''}

      <div class="section">
        <div class="section-title">#1 RECOMMENDATION</div>
        <div class="highlight-box">
          <h2 style="margin: 0 0 10px 0; color: #92400E; font-size: 24px;">${data.location.name}</h2>
          <div class="score">${data.location.score}/100</div>
          <span class="confidence">${data.location.confidence} CONFIDENCE</span>
        </div>
      </div>

      ${data.location.metrics && data.location.metrics.length > 0 ? `
      <div class="section">
        <div class="section-title">SCORE BREAKDOWN</div>
        <div class="metrics">
          ${metricsHTML || '<p>No metrics available</p>'}
        </div>
      </div>
      ` : '<div class="section"><div class="section-title">SCORE BREAKDOWN</div><div class="metrics"><p>No metrics available</p></div></div>'}

      ${data.location.competitors && data.location.competitors.length > 0 ? `
      <div class="section">
        <div class="section-title">COMPETITOR ANALYSIS</div>
        <div class="competitors">
          <p><strong>Found ${data.location.competitors.length} competitor${data.location.competitors.length !== 1 ? 's' : ''} within 0.5 miles:</strong></p>
          ${competitorsHTML}
        </div>
      </div>
      ` : `
      <div class="section">
        <div class="section-title">COMPETITOR ANALYSIS</div>
        <div class="competitors">
          <p>No competitors found in the immediate area. This location offers a unique market opportunity.</p>
        </div>
      </div>
      `}

      ${data.location.revenue && data.location.revenue.length > 0 ? `
      <div class="section">
        <div class="section-title">REVENUE PROJECTION</div>
        <div class="revenue">
          ${revenueHTML}
        </div>
      </div>
      ` : '<div class="section"><div class="section-title">REVENUE PROJECTION</div><div class="revenue"><p>Revenue projections not available</p></div></div>'}

      <div class="data-source">
        <p><strong>Data Sources:</strong></p>
        <p>• Foot traffic: NYC Open Data, Business Licenses 2024</p>
        <p>• Competitors: Google Places API (live data)</p>
        <p>• Demographics: Census ACS 2023</p>
      </div>

      <div class="footer">
        Generated by Vantage | Location Intelligence Platform
      </div>
    </body>
    </html>
  `;
};
