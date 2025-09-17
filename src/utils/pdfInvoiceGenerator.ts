import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Interface definitions for invoice data types
interface UserInvoiceData {
  payment_id: string;
  created_at: string;
  amount: number;
  discount: number;
  tax_amount: number;
  tax_type: string;
  total_amount: number;
  partner_code?: string;
  payment_status: string;
  tier?: string;
}

interface AdminInvoiceData {
  id: string;
  clientName: string;
  organizationName: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  createdDate: string;
  paidDate?: string;
  tier: string;
  paymentMethod?: string;
  invoiceNumber: string;
}

type InvoiceData = UserInvoiceData | AdminInvoiceData;

interface UserProfile {
  user_info: {
    name?: string;
    email?: string;
    client_name?: string;
  };
}

// Type guard to check if it's an admin invoice
const isAdminInvoice = (invoice: InvoiceData): invoice is AdminInvoiceData => {
  return 'invoiceNumber' in invoice;
};

/**
 * Generate and download a PDF invoice
 * @param invoice - Invoice data (either user or admin format)
 * @param userProfile - User profile information
 * @param filename - Optional custom filename for the PDF
 */
export const generateInvoicePDF = async (
  invoice: InvoiceData,
  userProfile?: UserProfile,
  filename?: string
): Promise<void> => {
  try {
    // Create a temporary container for the PDF content
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '210mm'; // A4 width
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.padding = '20mm';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    
    // Create the invoice content
    tempContainer.innerHTML = createInvoiceHTML(invoice, userProfile);
    
    // Add to DOM temporarily
    document.body.appendChild(tempContainer);
    
    // Generate canvas from HTML
    const canvas = await html2canvas(tempContainer, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123 // A4 height in pixels at 96 DPI
    });
    
    // Remove temp container
    document.body.removeChild(tempContainer);
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Calculate dimensions to fit A4
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Generate filename
    const defaultFilename = isAdminInvoice(invoice) 
      ? `Invoice_${invoice.invoiceNumber}_${new Date().toISOString().split('T')[0]}.pdf`
      : `Invoice_${invoice.payment_id}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Download the PDF
    pdf.save(filename || defaultFilename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

/**
 * Create HTML content for the invoice
 */
const createInvoiceHTML = (invoice: InvoiceData, userProfile?: UserProfile): string => {
  const currentDate = new Date().toLocaleDateString();
  
  // Company information
  const companyInfo = {
    name: "Cyorn",
    address: "123 Security Street",
    city: "Cyber City, CC 12345",
    phone: "+1 (555) 123-4567",
    email: "billing@cyorn.com",
    website: "www.cyorn.com"
  };

  const styles = `
    <style>
      body { 
        font-family: Arial, sans-serif; 
        line-height: 1.6; 
        color: #333; 
        margin: 0; 
        padding: 20px; 
        background: white;
      }
      .header { 
        display: flex; 
        justify-content: space-between; 
        align-items: flex-start; 
        margin-bottom: 30px; 
        padding-bottom: 20px; 
        border-bottom: 2px solid #e5e5e5; 
      }
      .company-info h1 { 
        color: #2563eb; 
        font-size: 28px; 
        margin-bottom: 10px; 
      }
      .company-info p { 
        margin: 2px 0; 
        font-size: 14px; 
        color: #666; 
      }
      .invoice-info h2 { 
        color: #333; 
        font-size: 24px; 
        margin-bottom: 10px; 
      }
      .invoice-info p { 
        margin: 5px 0; 
        font-size: 14px; 
      }
      .bill-to { 
        margin-bottom: 30px; 
      }
      .bill-to h3 { 
        font-size: 18px; 
        color: #333; 
        margin-bottom: 15px; 
      }
      .bill-to-content { 
        background: #f8f9fa; 
        padding: 15px; 
        border-radius: 5px; 
        border: 1px solid #e5e5e5; 
      }
      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin-bottom: 30px; 
      }
      th, td { 
        border: 1px solid #ddd; 
        padding: 12px; 
        text-align: left; 
      }
      th { 
        background-color: #f8f9fa; 
        font-weight: bold; 
      }
      .text-right { 
        text-align: right; 
      }
      .total-section { 
        width: 300px; 
        margin-left: auto; 
        margin-bottom: 30px; 
      }
      .total-box { 
        background: #f8f9fa; 
        padding: 20px; 
        border-radius: 5px; 
        border: 1px solid #e5e5e5; 
      }
      .total-row { 
        display: flex; 
        justify-content: space-between; 
        margin-bottom: 8px; 
      }
      .total-final { 
        border-top: 2px solid #ddd; 
        padding-top: 15px; 
        margin-top: 15px; 
        font-size: 18px; 
        font-weight: bold; 
      }
      .total-final .amount { 
        color: #2563eb; 
      }
      .status-badge { 
        padding: 6px 12px; 
        border-radius: 20px; 
        font-size: 12px; 
        font-weight: bold; 
        text-transform: uppercase; 
      }
      .status-paid { 
        background: #dcfce7; 
        color: #166534; 
      }
      .status-pending { 
        background: #fef3c7; 
        color: #92400e; 
      }
      .status-failed { 
        background: #fecaca; 
        color: #991b1b; 
      }
      .footer { 
        border-top: 1px solid #e5e5e5; 
        padding-top: 20px; 
        font-size: 12px; 
        color: #666; 
        margin-top: 30px; 
      }
      .footer-content { 
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        gap: 30px; 
        margin-bottom: 20px; 
      }
      .footer h4 { 
        font-weight: bold; 
        margin-bottom: 8px; 
        color: #333; 
      }
      .footer-bottom { 
        text-align: center; 
        padding-top: 15px; 
        border-top: 1px solid #f0f0f0; 
      }
      .text-green { 
        color: #059669; 
      }
    </style>
  `;

  const invoiceId = isAdminInvoice(invoice) ? invoice.invoiceNumber : `INV-${invoice.payment_id}`;
  const invoiceDate = isAdminInvoice(invoice) 
    ? new Date(invoice.createdDate).toLocaleDateString()
    : new Date(invoice.created_at).toLocaleDateString();
  const dueDate = isAdminInvoice(invoice) 
    ? new Date(invoice.dueDate).toLocaleDateString()
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();

  const status = isAdminInvoice(invoice) ? invoice.status : invoice.payment_status;
  const statusClass = 
    status === 'paid' || status === 'succeeded' ? 'status-paid' :
    status === 'pending' ? 'status-pending' : 'status-failed';

  const statusText = 
    status === 'paid' || status === 'succeeded' ? 'PAID' :
    status === 'pending' ? 'PENDING' : 
    status.toUpperCase();

  return `
    ${styles}
    <div class="header">
      <div class="company-info">
        <h1>${companyInfo.name}</h1>
        <p>${companyInfo.address}</p>
        <p>${companyInfo.city}</p>
        <p>Phone: ${companyInfo.phone}</p>
        <p>Email: ${companyInfo.email}</p>
        <p>Website: ${companyInfo.website}</p>
      </div>
      <div class="invoice-info" style="text-align: right;">
        <h2>INVOICE</h2>
        <p><strong>Invoice #:</strong> ${invoiceId}</p>
        <p><strong>Date:</strong> ${invoiceDate}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
      </div>
    </div>

    <div class="bill-to">
      <h3>Bill To:</h3>
      <div class="bill-to-content">
        ${isAdminInvoice(invoice) ? `
          <p><strong>${invoice.organizationName}</strong></p>
          <p>Client: ${invoice.clientName}</p>
          <p>Subscription Tier: ${invoice.tier}</p>
        ` : `
          <p><strong>${userProfile?.user_info.name || userProfile?.user_info.email || 'Customer'}</strong></p>
          <p>Client ID: ${userProfile?.user_info.client_name || 'N/A'}</p>
          ${invoice.tier ? `<p>Subscription Tier: ${invoice.tier}</p>` : ''}
        `}
      </div>
    </div>

    <div>
      <h3>Invoice Details:</h3>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${isAdminInvoice(invoice) ? `
            <tr>
              <td>${invoice.tier} Subscription</td>
              <td class="text-right">$${invoice.amount.toFixed(2)}</td>
            </tr>
          ` : `
            <tr>
              <td>Subscription Payment${invoice.tier ? ` - ${invoice.tier}` : ''}</td>
              <td class="text-right">$${invoice.amount.toFixed(2)}</td>
            </tr>
            ${invoice.discount > 0 ? `
              <tr>
                <td>Discount Applied${invoice.partner_code ? ` (${invoice.partner_code})` : ''}</td>
                <td class="text-right text-green">-$${invoice.discount.toFixed(2)}</td>
              </tr>
            ` : ''}
            <tr>
              <td>Tax (${invoice.tax_type})</td>
              <td class="text-right">$${invoice.tax_amount.toFixed(2)}</td>
            </tr>
          `}
        </tbody>
      </table>
    </div>

    <div class="total-section">
      <div class="total-box">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${isAdminInvoice(invoice) ? invoice.amount.toFixed(2) : invoice.amount.toFixed(2)}</span>
        </div>
        ${!isAdminInvoice(invoice) && invoice.discount > 0 ? `
          <div class="total-row text-green">
            <span>Discount:</span>
            <span>-$${invoice.discount.toFixed(2)}</span>
          </div>
        ` : ''}
        ${!isAdminInvoice(invoice) ? `
          <div class="total-row">
            <span>Tax:</span>
            <span>$${invoice.tax_amount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="total-row total-final">
          <span>Total Amount:</span>
          <span class="amount">$${
            isAdminInvoice(invoice) ? invoice.amount.toFixed(2) : invoice.total_amount.toFixed(2)
          }</span>
        </div>
      </div>
    </div>

    <div>
      <h3>Payment Status:</h3>
      <div class="bill-to-content">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span><strong>Status:</strong></span>
          <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        ${isAdminInvoice(invoice) && invoice.paidDate ? `
          <p style="margin-top: 10px;"><strong>Paid Date:</strong> ${new Date(invoice.paidDate).toLocaleDateString()}</p>
        ` : ''}
        ${isAdminInvoice(invoice) && invoice.paymentMethod ? `
          <p><strong>Payment Method:</strong> ${invoice.paymentMethod}</p>
        ` : ''}
      </div>
    </div>

    <div class="footer">
      <div class="footer-content">
        <div>
          <h4>Payment Terms:</h4>
          <p>Payment is due within 30 days of invoice date.</p>
          <p>Late payments may be subject to fees.</p>
        </div>
        <div>
          <h4>Questions?</h4>
          <p>Contact us at: ${companyInfo.email}</p>
          <p>Phone: ${companyInfo.phone}</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>Thank you for your business!</p>
        <p style="font-size: 10px;">This is a computer-generated invoice. Generated on ${currentDate}</p>
      </div>
    </div>
  `;
};

/**
 * Preview invoice in a new window/tab before downloading
 * @param invoice - Invoice data
 * @param userProfile - User profile information
 */
export const previewInvoicePDF = (invoice: InvoiceData, userProfile?: UserProfile): void => {
  const htmlContent = createInvoiceHTML(invoice, userProfile);
  const newWindow = window.open('', '_blank');
  
  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice Preview</title>
          <meta charset="utf-8">
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
    newWindow.document.close();
  } else {
    alert('Please allow popups to preview the invoice.');
  }
};

export default generateInvoicePDF;