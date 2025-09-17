import React from 'react';
import { generateInvoicePDF, previewInvoicePDF } from '../../utils/pdfInvoiceGenerator';

// Sample invoice data for testing
const sampleUserInvoice = {
  payment_id: 'pay_1234567890',
  created_at: '2024-01-15T10:30:00Z',
  amount: 99.99,
  discount: 10.00,
  tax_amount: 8.99,
  tax_type: 'VAT',
  total_amount: 98.98,
  partner_code: 'PARTNER123',
  payment_status: 'succeeded',
  tier: 'Professional'
};

const sampleAdminInvoice = {
  id: '1',
  clientName: 'john_doe_acme',
  organizationName: 'Acme Corporation',
  amount: 199.99,
  status: 'paid' as const,
  dueDate: '2024-02-15',
  createdDate: '2024-01-15',
  paidDate: '2024-01-20',
  tier: 'Enterprise',
  paymentMethod: 'Credit Card',
  invoiceNumber: 'INV-2024-001'
};

const sampleUserProfile = {
  user_info: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    client_name: 'john_doe_acme'
  }
};

const PDFTestPage: React.FC = () => {
  const handleUserInvoiceDownload = async () => {
    try {
      await generateInvoicePDF(sampleUserInvoice, sampleUserProfile);
    } catch (error) {
      console.error('Error generating user invoice PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleAdminInvoiceDownload = async () => {
    try {
      await generateInvoicePDF(sampleAdminInvoice, sampleUserProfile);
    } catch (error) {
      console.error('Error generating admin invoice PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleUserInvoicePreview = () => {
    try {
      previewInvoicePDF(sampleUserInvoice, sampleUserProfile);
    } catch (error) {
      console.error('Error previewing user invoice PDF:', error);
      alert('Failed to preview PDF. Please try again.');
    }
  };

  const handleAdminInvoicePreview = () => {
    try {
      previewInvoicePDF(sampleAdminInvoice, sampleUserProfile);
    } catch (error) {
      console.error('Error previewing admin invoice PDF:', error);
      alert('Failed to preview PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          PDF Invoice Generator Test
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Invoice Test */}
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl border border-secondary-700/50 p-6">
            <h2 className="text-2xl font-bold text-primary-300 mb-4">User Invoice Test</h2>
            <div className="bg-secondary-700/30 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-white mb-2">Sample Data:</h3>
              <div className="text-sm text-secondary-300 space-y-1">
                <p><strong>Invoice ID:</strong> {sampleUserInvoice.payment_id}</p>
                <p><strong>Amount:</strong> ${sampleUserInvoice.amount}</p>
                <p><strong>Discount:</strong> ${sampleUserInvoice.discount}</p>
                <p><strong>Tax:</strong> ${sampleUserInvoice.tax_amount} ({sampleUserInvoice.tax_type})</p>
                <p><strong>Total:</strong> ${sampleUserInvoice.total_amount}</p>
                <p><strong>Status:</strong> {sampleUserInvoice.payment_status}</p>
                <p><strong>Tier:</strong> {sampleUserInvoice.tier}</p>
                <p><strong>Partner Code:</strong> {sampleUserInvoice.partner_code}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleUserInvoicePreview}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Preview PDF
              </button>
              <button
                onClick={handleUserInvoiceDownload}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Download PDF
              </button>
            </div>
          </div>

          {/* Admin Invoice Test */}
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl border border-secondary-700/50 p-6">
            <h2 className="text-2xl font-bold text-primary-300 mb-4">Admin Invoice Test</h2>
            <div className="bg-secondary-700/30 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-white mb-2">Sample Data:</h3>
              <div className="text-sm text-secondary-300 space-y-1">
                <p><strong>Invoice #:</strong> {sampleAdminInvoice.invoiceNumber}</p>
                <p><strong>Organization:</strong> {sampleAdminInvoice.organizationName}</p>
                <p><strong>Client:</strong> {sampleAdminInvoice.clientName}</p>
                <p><strong>Amount:</strong> ${sampleAdminInvoice.amount}</p>
                <p><strong>Status:</strong> {sampleAdminInvoice.status}</p>
                <p><strong>Tier:</strong> {sampleAdminInvoice.tier}</p>
                <p><strong>Due Date:</strong> {sampleAdminInvoice.dueDate}</p>
                <p><strong>Payment Method:</strong> {sampleAdminInvoice.paymentMethod}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAdminInvoicePreview}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Preview PDF
              </button>
              <button
                onClick={handleAdminInvoiceDownload}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl border border-secondary-700/50 p-6">
          <h2 className="text-xl font-bold text-primary-300 mb-4">Instructions</h2>
          <div className="text-secondary-300 space-y-2">
            <p>🔍 <strong>Preview PDF:</strong> Opens the invoice in a new window/tab for preview</p>
            <p>📥 <strong>Download PDF:</strong> Generates and downloads the PDF file directly</p>
            <p>📋 The PDF includes company information, invoice details, billing information, and payment status</p>
            <p>🎨 The design is optimized for both user invoices (with discounts, taxes) and admin invoices (simpler structure)</p>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-8 bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl border border-secondary-700/50 p-6">
          <h2 className="text-xl font-bold text-primary-300 mb-4">PDF Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-secondary-300">
            <div>
              <h3 className="font-semibold text-white mb-2">Design Features:</h3>
              <ul className="space-y-1 text-sm">
                <li>✅ Professional layout with company branding</li>
                <li>✅ Responsive design optimized for A4 printing</li>
                <li>✅ Color-coded status indicators</li>
                <li>✅ Detailed billing breakdown</li>
                <li>✅ Tax and discount calculations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Technical Features:</h3>
              <ul className="space-y-1 text-sm">
                <li>✅ HTML to PDF conversion using html2canvas + jsPDF</li>
                <li>✅ High-quality rendering (2x scale)</li>
                <li>✅ Multi-page support for long invoices</li>
                <li>✅ Custom filename generation</li>
                <li>✅ Error handling and user feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFTestPage;