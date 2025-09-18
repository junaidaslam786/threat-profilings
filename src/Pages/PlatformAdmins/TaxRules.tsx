import React, { useState } from 'react';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import InputField from '../../components/Common/InputField';

interface TaxRule {
  id: string;
  country: string;
  region?: string;
  taxType: string;
  rate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const TaxRules: React.FC = () => {
  const [taxRules, setTaxRules] = useState<TaxRule[]>([
    {
      id: '1',
      country: 'United States',
      region: 'California',
      taxType: 'Sales Tax',
      rate: 8.25,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      country: 'United Kingdom',
      taxType: 'VAT',
      rate: 20.0,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '3',
      country: 'Canada',
      region: 'Ontario',
      taxType: 'HST',
      rate: 13.0,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<TaxRule | null>(null);
  const [newRule, setNewRule] = useState({
    country: '',
    region: '',
    taxType: '',
    rate: 0
  });

  const handleCreateRule = () => {
    const rule: TaxRule = {
      id: Date.now().toString(),
      country: newRule.country,
      region: newRule.region || undefined,
      taxType: newRule.taxType,
      rate: newRule.rate,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setTaxRules([...taxRules, rule]);
    setNewRule({ country: '', region: '', taxType: '', rate: 0 });
    setShowModal(false);
  };

  const handleEditRule = (rule: TaxRule) => {
    setEditingRule(rule);
    setNewRule({
      country: rule.country,
      region: rule.region || '',
      taxType: rule.taxType,
      rate: rule.rate
    });
    setShowModal(true);
  };

  const handleUpdateRule = () => {
    if (!editingRule) return;
    
    const updatedRules = taxRules.map(rule =>
      rule.id === editingRule.id
        ? {
            ...rule,
            country: newRule.country,
            region: newRule.region || undefined,
            taxType: newRule.taxType,
            rate: newRule.rate,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : rule
    );
    setTaxRules(updatedRules);
    setEditingRule(null);
    setNewRule({ country: '', region: '', taxType: '', rate: 0 });
    setShowModal(false);
  };

  const handleToggleActive = (id: string) => {
    const updatedRules = taxRules.map(rule =>
      rule.id === id
        ? { ...rule, isActive: !rule.isActive, updatedAt: new Date().toISOString().split('T')[0] }
        : rule
    );
    setTaxRules(updatedRules);
  };

  const handleDeleteRule = (id: string) => {
    if (confirm('Are you sure you want to delete this tax rule?')) {
      setTaxRules(taxRules.filter(rule => rule.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Tax Rules Management</h1>
            <p className="text-gray-400">Configure tax rates for different regions and jurisdictions</p>
          </div>
          <Button
            onClick={() => {
              setEditingRule(null);
              setNewRule({ country: '', region: '', taxType: '', rate: 0 });
              setShowModal(true);
            }}
            className="bg-secondary-600 hover:bg-secondary-700"
          >
            Add Tax Rule
          </Button>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Country/Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tax Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Rate (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {taxRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{rule.country}</div>
                        {rule.region && (
                          <div className="text-sm text-gray-400">{rule.region}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {rule.taxType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {rule.rate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        rule.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {rule.updatedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditRule(rule)}
                        className="text-secondary-400 hover:text-secondary-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(rule.id)}
                        className={`${
                          rule.isActive 
                            ? 'text-red-400 hover:text-red-300' 
                            : 'text-green-400 hover:text-green-300'
                        }`}
                      >
                        {rule.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Tax Rule Modal */}
        <Modal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingRule(null);
            setNewRule({ country: '', region: '', taxType: '', rate: 0 });
          }}
          size="lg"
        >
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingRule ? 'Edit Tax Rule' : 'Create Tax Rule'}
            </h3>
            
            <InputField
              label="Country"
              type="text"
              name="country"
              value={newRule.country}
              onChange={(e) => setNewRule({ ...newRule, country: e.target.value })}
              placeholder="Enter country name"
              required
            />
            
            <InputField
              label="Region/State (Optional)"
              type="text"
              name="region"
              value={newRule.region}
              onChange={(e) => setNewRule({ ...newRule, region: e.target.value })}
              placeholder="Enter region or state"
            />
            
            <InputField
              label="Tax Type"
              type="text"
              name="taxType"
              value={newRule.taxType}
              onChange={(e) => setNewRule({ ...newRule, taxType: e.target.value })}
              placeholder="e.g., VAT, Sales Tax, GST"
              required
            />
            
            <div className="mb-4">
              <label htmlFor="rate" className="block text-gray-300 text-sm font-bold mb-2">
                Tax Rate (%)
              </label>
              <input
                id="rate"
                type="number"
                name="rate"
                value={newRule.rate.toString()}
                onChange={(e) => setNewRule({ ...newRule, rate: parseFloat(e.target.value) || 0 })}
                placeholder="Enter tax rate percentage"
                min="0"
                max="100"
                step="0.01"
                required
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-secondary-600 focus:border-transparent transition duration-300 ease-in-out border-gray-600 bg-gray-700 text-white"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                onClick={() => {
                  setShowModal(false);
                  setEditingRule(null);
                  setNewRule({ country: '', region: '', taxType: '', rate: 0 });
                }}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={editingRule ? handleUpdateRule : handleCreateRule}
                className="bg-secondary-600 hover:bg-secondary-700"
                disabled={!newRule.country || !newRule.taxType || newRule.rate <= 0}
              >
                {editingRule ? 'Update' : 'Create'} Tax Rule
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TaxRules;
