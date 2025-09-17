import React, { useState } from 'react';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import InputField from '../../components/Common/InputField';
import { generateInvoicePDF, previewInvoicePDF } from '../../utils/pdfInvoiceGenerator';

interface Invoice {
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

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      clientName: 'john_doe_acme',
      organizationName: 'Acme Corporation',
      amount: 99.99,
      status: 'paid',
      dueDate: '2024-02-15',
      createdDate: '2024-01-15',
      paidDate: '2024-01-20',
      tier: 'Professional',
      paymentMethod: 'Credit Card',
      invoiceNumber: 'INV-2024-001'
    },
    {
      id: '2',
      clientName: 'security_solutions_inc',
      organizationName: 'Security Solutions Inc',
      amount: 199.99,
      status: 'pending',
      dueDate: '2024-03-01',
      createdDate: '2024-02-01',
      tier: 'Enterprise',
      invoiceNumber: 'INV-2024-002'
    },
    {
      id: '3',
      clientName: 'tech_startup_xyz',
      organizationName: 'Tech Startup XYZ',
      amount: 49.99,
      status: 'overdue',
      dueDate: '2024-01-30',
      createdDate: '2024-01-01',
      tier: 'Basic',
      invoiceNumber: 'INV-2024-003'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    clientName: '',
    organizationName: '',
    amount: 0,
    tier: '',
    dueDate: ''
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue' | 'cancelled'>('all');

  // PDF Generation handlers
  const handleDownloadPDF = async (invoice: Invoice) => {
    setIsGeneratingPDF(true);
    try {
      // Create a user profile object for the admin invoice
      const userProfile = {
        user_info: {
          name: invoice.organizationName,
          email: `${invoice.clientName}@example.com`,
          client_name: invoice.clientName
        }
      };
      await generateInvoicePDF(invoice, userProfile);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePreviewPDF = (invoice: Invoice) => {
    try {
      // Create a user profile object for the admin invoice
      const userProfile = {
        user_info: {
          name: invoice.organizationName,
          email: `${invoice.clientName}@example.com`,
          client_name: invoice.clientName
        }
      };
      previewInvoicePDF(invoice, userProfile);
    } catch (error) {
      console.error('Error previewing PDF:', error);
      alert('Failed to preview PDF. Please try again.');
    }
  };

  const filteredInvoices = invoices.filter(invoice => 
    filter === 'all' || invoice.status === filter
  );

  const handleCreateInvoice = () => {
    const invoice: Invoice = {
      id: Date.now().toString(),
      clientName: newInvoice.clientName,
      organizationName: newInvoice.organizationName,
      amount: newInvoice.amount,
      status: 'pending',
      dueDate: newInvoice.dueDate,
      createdDate: new Date().toISOString().split('T')[0],
      tier: newInvoice.tier,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`
    };
    setInvoices([...invoices, invoice]);
    setNewInvoice({ clientName: '', organizationName: '', amount: 0, tier: '', dueDate: '' });
    setShowModal(false);
  };

  const handleUpdateStatus = (id: string, status: Invoice['status']) => {
    const updatedInvoices = invoices.map(invoice =>
      invoice.id === id
        ? {
            ...invoice,
            status,
            paidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : undefined
          }
        : invoice
    );
    setInvoices(updatedInvoices);
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalAmount = () => {
    return filteredInvoices.reduce((total, invoice) => total + invoice.amount, 0);
  };

  const getStatusCounts = () => {
    return {
      all: invoices.length,
      pending: invoices.filter(i => i.status === 'pending').length,
      paid: invoices.filter(i => i.status === 'paid').length,
      overdue: invoices.filter(i => i.status === 'overdue').length,
      cancelled: invoices.filter(i => i.status === 'cancelled').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Invoice Management</h1>
            <p className="text-gray-400">Manage all client invoices and payments across organizations</p>
          </div>
          <Button
            onClick={() => {
              setNewInvoice({ clientName: '', organizationName: '', amount: 0, tier: '', dueDate: '' });
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create Invoice
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-6">
          <div className="inline-flex space-x-2 bg-gray-800 p-1 rounded-lg">
            {(['all', 'pending', 'paid', 'overdue', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg border border-blue-700">
            <h3 className="text-sm font-medium text-gray-400">Total Amount</h3>
            <p className="text-2xl font-bold text-white">${getTotalAmount().toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-green-700">
            <h3 className="text-sm font-medium text-gray-400">Paid Invoices</h3>
            <p className="text-2xl font-bold text-green-400">{statusCounts.paid}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-yellow-700">
            <h3 className="text-sm font-medium text-gray-400">Pending</h3>
            <p className="text-2xl font-bold text-yellow-400">{statusCounts.pending}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-red-700">
            <h3 className="text-sm font-medium text-gray-400">Overdue</h3>
            <p className="text-2xl font-bold text-red-400">{statusCounts.overdue}</p>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {invoice.organizationName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {invoice.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ${invoice.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {invoice.tier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {invoice.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(invoice.id, 'paid')}
                          className="text-green-400 hover:text-green-300"
                        >
                          Mark Paid
                        </button>
                      )}
                      {invoice.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(invoice.id, 'cancelled')}
                          className="text-red-400 hover:text-red-300"
                        >
                          Cancel
                        </button>
                      )}
                      <button className="text-blue-400 hover:text-blue-300">
                        View Details
                      </button>
                      <button
                        onClick={() => handlePreviewPDF(invoice)}
                        className="text-purple-400 hover:text-purple-300"
                        title="Preview Invoice PDF"
                      >
                        Preview PDF
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(invoice)}
                        disabled={isGeneratingPDF}
                        className="text-green-400 hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Download Invoice PDF"
                      >
                        {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Invoice Modal */}
        <Modal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setNewInvoice({ clientName: '', organizationName: '', amount: 0, tier: '', dueDate: '' });
          }}
          size="lg"
        >
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">
              Create New Invoice
            </h3>
            
            <InputField
              label="Client Name"
              type="text"
              name="clientName"
              value={newInvoice.clientName}
              onChange={(e) => setNewInvoice({ ...newInvoice, clientName: e.target.value })}
              placeholder="Enter client name (e.g., john_doe_acme)"
              required
            />
            
            <InputField
              label="Organization Name"
              type="text"
              name="organizationName"
              value={newInvoice.organizationName}
              onChange={(e) => setNewInvoice({ ...newInvoice, organizationName: e.target.value })}
              placeholder="Enter organization name"
              required
            />
            
            <InputField
              label="Subscription Tier"
              type="text"
              name="tier"
              value={newInvoice.tier}
              onChange={(e) => setNewInvoice({ ...newInvoice, tier: e.target.value })}
              placeholder="e.g., Basic, Professional, Enterprise"
              required
            />
            
            <div className="mb-4">
              <label htmlFor="amount" className="block text-gray-300 text-sm font-bold mb-2">
                Amount ($)
              </label>
              <input
                id="amount"
                type="number"
                name="amount"
                value={newInvoice.amount.toString()}
                onChange={(e) => setNewInvoice({ ...newInvoice, amount: parseFloat(e.target.value) || 0 })}
                placeholder="Enter invoice amount"
                min="0"
                step="0.01"
                required
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300 ease-in-out border-gray-600 bg-gray-700 text-white"
              />
            </div>
            
            <InputField
              label="Due Date"
              type="date"
              name="dueDate"
              value={newInvoice.dueDate}
              onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
              required
            />
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                onClick={() => {
                  setShowModal(false);
                  setNewInvoice({ clientName: '', organizationName: '', amount: 0, tier: '', dueDate: '' });
                }}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateInvoice}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!newInvoice.clientName || !newInvoice.organizationName || !newInvoice.tier || newInvoice.amount <= 0 || !newInvoice.dueDate}
              >
                Create Invoice
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Invoices;
