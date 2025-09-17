import React from 'react';

// Interface for invoice data from the InvoicesPage (user invoices)
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

// Interface for invoice data from the PlatformAdmin Invoices (admin invoices)
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

// Union type for both invoice types
type InvoiceData = UserInvoiceData | AdminInvoiceData;

interface InvoicePDFProps {
  invoice: InvoiceData;
  userProfile?: {
    user_info: {
      name?: string;
      email?: string;
      client_name?: string;
    };
  };
}

// Type guard to check if it's an admin invoice
const isAdminInvoice = (invoice: InvoiceData): invoice is AdminInvoiceData => {
  return 'invoiceNumber' in invoice;
};

const InvoicePDF: React.FC<InvoicePDFProps> = ({ 
  invoice, 
  userProfile 
}) => {
  const currentDate = new Date().toLocaleDateString();
  
  // Company/Platform Information
  const companyInfo = {
    name: "Threat Profiling Platform",
    address: "123 Security Street",
    city: "Cyber City, CC 12345",
    phone: "+1 (555) 123-4567",
    email: "billing@threatprofiling.com",
    website: "www.threatprofiling.com"
  };

  return (
    <div 
      id="invoice-pdf-content" 
      className="bg-white text-black p-8 max-w-4xl mx-auto"
      style={{ 
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8 border-b border-gray-300 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            {companyInfo.name}
          </h1>
          <div className="text-sm text-gray-600">
            <p>{companyInfo.address}</p>
            <p>{companyInfo.city}</p>
            <p>Phone: {companyInfo.phone}</p>
            <p>Email: {companyInfo.email}</p>
            <p>Website: {companyInfo.website}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">INVOICE</h2>
          <div className="text-sm">
            <p><strong>Invoice #:</strong> {
              isAdminInvoice(invoice) 
                ? invoice.invoiceNumber 
                : `INV-${invoice.payment_id}`
            }</p>
            <p><strong>Date:</strong> {
              isAdminInvoice(invoice) 
                ? new Date(invoice.createdDate).toLocaleDateString()
                : new Date(invoice.created_at).toLocaleDateString()
            }</p>
            <p><strong>Due Date:</strong> {
              isAdminInvoice(invoice) 
                ? new Date(invoice.dueDate).toLocaleDateString()
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() // 30 days from creation
            }</p>
          </div>
        </div>
      </div>

      {/* Bill To Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Bill To:</h3>
        <div className="bg-gray-50 p-4 rounded border">
          {isAdminInvoice(invoice) ? (
            <>
              <p className="font-semibold">{invoice.organizationName}</p>
              <p>Client: {invoice.clientName}</p>
              <p>Subscription Tier: {invoice.tier}</p>
            </>
          ) : (
            <>
              <p className="font-semibold">
                {userProfile?.user_info.name || userProfile?.user_info.email || 'Customer'}
              </p>
              <p>Client ID: {userProfile?.user_info.client_name || 'N/A'}</p>
              {invoice.tier && <p>Subscription Tier: {invoice.tier}</p>}
            </>
          )}
        </div>
      </div>

      {/* Invoice Details Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Invoice Details:</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left">Description</th>
              <th className="border border-gray-300 px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {isAdminInvoice(invoice) ? (
              <>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    {invoice.tier} Subscription
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right">
                    ${invoice.amount.toFixed(2)}
                  </td>
                </tr>
              </>
            ) : (
              <>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    Subscription Payment{invoice.tier ? ` - ${invoice.tier}` : ''}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right">
                    ${invoice.amount.toFixed(2)}
                  </td>
                </tr>
                {invoice.discount > 0 && (
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">
                      Discount Applied{invoice.partner_code ? ` (${invoice.partner_code})` : ''}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right text-green-600">
                      -${invoice.discount.toFixed(2)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    Tax ({invoice.tax_type})
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right">
                    ${invoice.tax_amount.toFixed(2)}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Total Section */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="bg-gray-100 p-4 rounded border">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Subtotal:</span>
              <span>${
                isAdminInvoice(invoice) 
                  ? invoice.amount.toFixed(2) 
                  : invoice.amount.toFixed(2)
              }</span>
            </div>
            {!isAdminInvoice(invoice) && invoice.discount > 0 && (
              <div className="flex justify-between items-center mb-2 text-green-600">
                <span>Discount:</span>
                <span>-${invoice.discount.toFixed(2)}</span>
              </div>
            )}
            {!isAdminInvoice(invoice) && (
              <div className="flex justify-between items-center mb-2">
                <span>Tax:</span>
                <span>${invoice.tax_amount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-blue-600">${
                  isAdminInvoice(invoice) 
                    ? invoice.amount.toFixed(2) 
                    : invoice.total_amount.toFixed(2)
                }</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Payment Status:</h3>
        <div className="bg-gray-50 p-4 rounded border">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              (isAdminInvoice(invoice) ? invoice.status : invoice.payment_status) === 'paid' || 
              (isAdminInvoice(invoice) ? invoice.status : invoice.payment_status) === 'succeeded'
                ? 'bg-green-100 text-green-800'
                : (isAdminInvoice(invoice) ? invoice.status : invoice.payment_status) === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {isAdminInvoice(invoice) ? invoice.status.toUpperCase() : 
               invoice.payment_status === 'succeeded' ? 'PAID' : 
               invoice.payment_status.toUpperCase()}
            </span>
          </div>
          {isAdminInvoice(invoice) && invoice.paidDate && (
            <p className="mt-2 text-sm text-gray-600">
              <strong>Paid Date:</strong> {new Date(invoice.paidDate).toLocaleDateString()}
            </p>
          )}
          {isAdminInvoice(invoice) && invoice.paymentMethod && (
            <p className="mt-1 text-sm text-gray-600">
              <strong>Payment Method:</strong> {invoice.paymentMethod}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 pt-6 text-sm text-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Payment Terms:</h4>
            <p>Payment is due within 30 days of invoice date.</p>
            <p>Late payments may be subject to fees.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Questions?</h4>
            <p>Contact us at: {companyInfo.email}</p>
            <p>Phone: {companyInfo.phone}</p>
          </div>
        </div>
        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <p>Thank you for your business!</p>
          <p className="text-xs">This is a computer-generated invoice. Generated on {currentDate}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePDF;