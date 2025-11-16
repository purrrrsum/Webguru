'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/utils';

interface ProfileFormProps {
  initialData?: Partial<User> & { warning?: string };
  onSave: (data: Partial<User>) => Promise<(Partial<User> & { warning?: string }) | void>;
}

export default function ProfileForm({ initialData, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    address: '',
    phone: '',
    upiId: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankIfsc: '',
    bankName: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        company: initialData.company || '',
        address: initialData.address || '',
        phone: initialData.phone || '',
        upiId: initialData.upiId || '',
        bankAccountName: initialData.bankAccountName || '',
        bankAccountNumber: initialData.bankAccountNumber || '',
        bankIfsc: initialData.bankIfsc || '',
        bankName: initialData.bankName || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await onSave(formData);
      if (result && 'warning' in result && result.warning) {
        setMessage({ type: 'error', text: result.warning });
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green text-white placeholder-gray-400"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green text-white placeholder-gray-400"
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
          Company
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green text-white placeholder-gray-400"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green text-white placeholder-gray-400"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green text-white placeholder-gray-400"
        />
      </div>

      {initialData?.role === 'agent' && (
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-4">
          <p className="text-sm font-semibold text-gray-200">Payment details (visible only to admins)</p>
          <p className="text-xs text-gray-400 mb-3">
            Provide payout information so the finance team can release your earnings.
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-300 mb-1">
                UPI ID
              </label>
              <input
                type="text"
                id="upiId"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                placeholder="e.g. thesupport@upi"
                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="bankAccountName" className="block text-sm font-medium text-gray-300 mb-1">
                Account holder name
              </label>
              <input
                type="text"
                id="bankAccountName"
                name="bankAccountName"
                value={formData.bankAccountName}
                onChange={handleChange}
                placeholder="Name as per bank records"
                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-300 mb-1">
                Account number
              </label>
              <input
                type="text"
                id="bankAccountNumber"
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="bankIfsc" className="block text-sm font-medium text-gray-300 mb-1">
                IFSC code
              </label>
              <input
                type="text"
                id="bankIfsc"
                name="bankIfsc"
                value={formData.bankIfsc}
                onChange={handleChange}
                placeholder="e.g. HDFC0001234"
                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-md uppercase focus:ring-whatsapp-green focus:border-whatsapp-green text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-300 mb-1">
                Bank & branch
              </label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="e.g. HDFC Bank, MG Road"
                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-md focus:ring-whatsapp-green focus:border-whatsapp-green text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`p-3 rounded-md ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-300 border border-green-500/40'
              : 'bg-red-500/20 text-red-300 border border-red-500/40'
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-whatsapp-green hover:bg-whatsapp-green-dark text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}

